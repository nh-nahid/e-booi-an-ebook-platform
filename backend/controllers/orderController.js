const Cart = require("../models/Cart");
const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const orderEmail = require("../emails/templates/orderEmail");
const Coupon = require("../models/Coupon");
const path = require("path");
const { libraryBooks, hasBookAccess } = require("../utils/access");

// Payment methods the storefront can send. Every online method (bKash, Nagad,
// Rocket, cards) is processed through the EPS gateway. Cash on Delivery was
// removed when eBooi became Digital-only.
const GATEWAY_MAP = {
  eps: "eps",
};

// order create
async function createOrder(req, res, next) {
  try {
    const { paymentMethod, couponCode, items } = req.body;

    const gateway = GATEWAY_MAP[paymentMethod];

    if (!gateway) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // "Buy now" — a direct single-book order placed from a book page,
    // skipping the cart entirely. When `items` is sent, source straight
    // from the requested books instead of the user's Cart, and never
    // touch the Cart collection for this order.
    const isBuyNow = Array.isArray(items) && items.length > 0;

    let sourceItems;

    if (isBuyNow) {
      sourceItems = [];

      for (const { bookId, quantity } of items) {
        const book = await Book.findById(bookId);

        if (!book) {
          return res.status(404).json({
            message: "Book not found",
          });
        }

        sourceItems.push({ book, quantity: quantity > 0 ? quantity : 1 });
      }
    } else {
      const cartItems = await Cart.find({
        user: req.user.id,
      }).populate("book");

      if (!cartItems.length) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }

      sourceItems = cartItems
        .filter((item) => item.book)
        .map((item) => ({ book: item.book, quantity: item.quantity }));
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const { book, quantity } of sourceItems) {
      orderItems.push({
        book: book._id,
        quantity,
        price: book.price,
        bookType: book.bookType,
      });

      totalAmount += quantity * book.price;
    }

    let discountAmount = 0;
    let finalAmount = totalAmount;
    let couponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({
          message: "Invalid coupon",
        });
      }

      // Restricted coupon (e.g. EB100) — only allowed for specific emails.
      // Same generic message as a missing coupon, and this mirrors the
      // check in couponController.applyCoupon so the restriction can't be
      // bypassed by skipping the preview step and placing the order directly.
      if (coupon.allowedEmails && coupon.allowedEmails.length > 0) {
        const requester = await User.findById(req.user.id);
        const requesterEmail = requester?.email?.trim().toLowerCase();
        const isAllowed =
          requesterEmail &&
          coupon.allowedEmails.some(
            (email) => email.trim().toLowerCase() === requesterEmail
          );

        if (!isAllowed) {
          return res.status(400).json({
            message: "Invalid coupon",
          });
        }
      }

      if (new Date() > coupon.expiryDate) {
        return res.status(400).json({
          message: "Coupon expired",
        });
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          message: "Coupon limit exceeded",
        });
      }

      if (totalAmount < coupon.minimumAmount) {
        return res.status(400).json({
          message: `Minimum order amount is ${coupon.minimumAmount}`,
        });
      }

      if (coupon.type === "percentage") {
        discountAmount = (totalAmount * coupon.value) / 100;
      } else {
        discountAmount = coupon.value;
      }

      finalAmount = totalAmount - discountAmount;

      if (finalAmount < 0) {
        finalAmount = 0;
      }

      coupon.usedCount += 1;
      await coupon.save();

      couponId = coupon._id;
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,

      totalAmount,
      discountAmount,
      finalAmount,

      coupon: couponId,

      paymentMethod: gateway,

      paymentStatus: "pending",
      orderStatus: "pending",

      fromCart: !isBuyNow,
    });

    await order.save();

    // Stock/cart-clearing for a completed purchase now happens only in
    // paymentSuccess (payment gateway confirmation) — there is no more
    // COD path that needs to settle those immediately here.

    // Send response immediately — don't make the customer wait on email
    // delivery. A slow/hanging SMTP connection (common on hosts like Render
    // if outbound SMTP ports are blocked or slow) would otherwise stall
    // this entire request indefinitely, since res.json() can't fire until
    // everything before it resolves.
    res.status(201).json({
      message: "Order created successfully",
      order,
    });

    // Fire the confirmation email in the background. Errors are caught and
    // logged only — a failed/slow email must never crash or hang the order
    // creation flow, since the order itself already succeeded.
    User.findById(req.user.id)
      .then((user) => {
        if (!user) return;
        return sendEmail({
          to: user.email,
          subject: "Order Confirmation",
          html: orderEmail(user, order),
        });
      })
      .catch((err) => {
        console.error("Order confirmation email failed:", err);
      });
  } catch (error) {
    next(error);
  }
}

// get order
async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).populate("items.book");

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// get single order (owner or admin only)
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate("items.book");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// download Digital books
async function downloadBook(req, res, next) {
  try {
    const accessibleBook = await hasBookAccess(req.user.id, req.params.bookId);

    if (!accessibleBook) {
      return res.status(403).json({
        message: "Book not purchased",
      });
    }

    const item = { book: accessibleBook };

    if (item.book.bookType !== "Digital") {
      return res.status(400).json({
        message: "Not a Digital book",
      });
    }

    // pdfFile is a Cloudinary secure_url (post-migration). This is
    // fetched and streamed through our own server rather than
    // `res.redirect()`-ed to the client — a redirect sends the browser's
    // XHR across origins (our API -> Cloudinary), and since our axios
    // instance uses `withCredentials: true`, that cross-origin follow-up
    // request gets blocked by CORS (Cloudinary's public delivery
    // response isn't set up for credentialed cross-origin reads),
    // leaving the frontend request hanging with no usable
    // success/error response. Streaming keeps the whole exchange
    // same-origin from the browser's point of view.
    if (!item.book.pdfFile) {
      return res.status(404).json({
        message: "Book file not found",
      });
    }

    const fileResponse = await fetch(item.book.pdfFile);

    if (!fileResponse.ok) {
      return res.status(502).json({
        message: "Book file could not be retrieved",
      });
    }

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

    // HTTP header values must be Latin-1 — Bengali book titles aren't, so
    // setting `filename="<বাংলা title>.pdf"` directly throws
    // ERR_INVALID_CHAR (Node rejects the header) and the whole request
    // 500s. Use a plain ASCII fallback plus the RFC 5987 UTF-8-encoded
    // form, which every modern browser reads correctly for the real name.
    const encodedTitle = encodeURIComponent(`${item.book.title}.pdf`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="book.pdf"; filename*=UTF-8''${encodedTitle}`,
    );

    return res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
}

// update payment status
async function updatePaymentStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: req.body.paymentStatus,
      },
      { returnDocument: "after" },
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// user Digital library
async function getLibrary(req, res, next) {
  try {
    // All accessible books, each flagged with isHidden. Hidden (removed) books
    // still count as owned elsewhere (e.g. the "buy" button), so the client
    // decides what to show.
    const [books, me] = await Promise.all([
      libraryBooks(req.user.id),
      User.findById(req.user.id).select("hiddenBooks"),
    ]);
    const hidden = new Set((me?.hiddenBooks || []).map(String));

    // When the user got each book: first paid order that contains it; books
    // from a subscription or an admin grant fall back to the book's date.
    const paid = await Order.find({ user: req.user.id, paymentStatus: "paid" })
      .select("items.book paidAt createdAt");
    const acquired = new Map();
    paid.forEach((o) => {
      const when = o.paidAt || o.createdAt;
      o.items.forEach((i) => {
        const id = i.book?.toString();
        if (id && (!acquired.has(id) || when < acquired.get(id))) acquired.set(id, when);
      });
    });

    res.json(
      books.map((b) => ({
        ...b.toObject(),
        isHidden: hidden.has(b._id.toString()),
        acquiredAt: acquired.get(b._id.toString()) || b.createdAt,
      })),
    );
  } catch (error) {
    next(error);
  }
}

// remove a book from the library view (or bring it back)
async function setLibraryHidden(req, res, next) {
  try {
    const hide = req.params.action === "hide";
    await User.findByIdAndUpdate(req.user.id, hide
      ? { $addToSet: { hiddenBooks: req.params.bookId } }
      : { $pull: { hiddenBooks: req.params.bookId } });
    res.json({ message: hide ? "Removed from library" : "Restored to library" });
  } catch (error) {
    next(error);
  }
}

// download invoice
async function downloadInvoice(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only the owner or an admin can download
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (!order.invoiceUrl) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "public",
      order.invoiceUrl.replace(/^\//, ""),
    );

    res.download(filePath);
  } catch (error) {
    next(error);
  }
}


// admin get all orders (paginated, filterable, searchable)
async function getOrders(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      orderStatus,
      paymentStatus,
    } = req.query;

    const query = {};

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Search by invoice number or transaction id directly on Order;
    // searching by user name/email requires a join, so we resolve
    // matching user ids first.
    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { transactionId: { $regex: search, $options: "i" } },
        { user: { $in: matchingUsers.map((u) => u._id) } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.book")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
      pagination: {
        total: totalOrders,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalOrders / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { returnDocument: "after", runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  downloadBook,
  updatePaymentStatus,
  getLibrary,
  setLibraryHidden,
  downloadInvoice,
};