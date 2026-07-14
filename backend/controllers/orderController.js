const Cart = require("../models/Cart");
const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const orderEmail = require("../emails/templates/orderEmail");
const Coupon = require("../models/Coupon");
const path = require("path");

// Map frontend payment method choices to the gateway used to process them.
// bKash/Nagad/card all route through the SSLCommerz integration; only COD
// is a distinct path. The Order schema's paymentMethod enum only knows
// about gateways ("cod" | "sslcommerz" | "stripe"), not specific methods.
const GATEWAY_MAP = {
  bkash: "sslcommerz",
  nagad: "sslcommerz",
  card: "sslcommerz",
  cod: "cod",
};

// order create
// order create
async function createOrder(req, res, next) {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    const gateway = GATEWAY_MAP[paymentMethod];

    if (!gateway) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("book");

    if (!cartItems.length) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    let hasDigital = false;

    // Build order items
    for (const item of cartItems) {
      const book = item.book;

      if (!book) continue;

      orderItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price,
        bookType: book.bookType,
      });

      totalAmount += item.quantity * book.price;

      if (book.bookType === "Physical") {
        if (book.stock < item.quantity) {
          return res.status(400).json({
            message: `${book.title} is out of stock`,
          });
        }
      }

      if (book.bookType === "Digital") {
        hasDigital = true;
      }
    }

    // COD restriction
    if (gateway === "cod" && hasDigital) {
      return res.status(400).json({
        message: "Cash on Delivery is not allowed for Digital books",
      });
    }

    // ======================
    // Coupon Logic
    // ======================

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

    // ======================
    // Create Order
    // ======================

    const order = new Order({
      user: req.user.id,
      items: orderItems,

      totalAmount,
      discountAmount,
      finalAmount,

      coupon: couponId,

      shippingAddress,
      paymentMethod: gateway,

      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await order.save();

    // For COD, the order is final immediately — reduce stock and clear
    // cart right away. For gateway payments (sslcommerz/stripe), both are
    // deferred until paymentSuccess actually confirms the payment, so a
    // failed/cancelled/abandoned payment doesn't reduce real inventory or
    // wipe a cart for a purchase that never completed.
    if (gateway === "cod") {
      for (const item of cartItems) {
        if (item.book.bookType === "Physical") {
          item.book.stock -= item.quantity;
          await item.book.save();
        }
      }

      await Cart.deleteMany({
        user: req.user.id,
      });
    }

    // Send email
    const user = await User.findById(req.user.id);

    await sendEmail({
      to: user.email,
      subject: "Order Confirmation",
      html: orderEmail(user, order),
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
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
    const order = await Order.findOne({
      user: req.user.id,
      paymentStatus: "paid",
      "items.book": req.params.bookId,
    }).populate("items.book");

    if (!order) {
      return res.status(403).json({
        message: "Book not purchased",
      });
    }

    const item = order.items.find(
      (item) => item.book._id.toString() === req.params.bookId,
    );

    if (item.book.bookType !== "Digital") {
      return res.status(400).json({
        message: "Not a Digital book",
      });
    }

    res.download(`public/uploads/pdfs/${item.book.pdfFile}`);
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
      { new: true },
    );

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// user Digital library
async function getLibrary(req, res, next) {
  try {
    const orders = await Order.find({
      user: req.user.id,
      paymentStatus: "paid",
    }).populate("items.book");

    const booksMap = new Map();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.book && item.book.bookType === "Digital") {
          booksMap.set(item.book._id.toString(), item.book);
        }
      });
    });

    const books = Array.from(booksMap.values());

    res.json(books);
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
  downloadInvoice,
};