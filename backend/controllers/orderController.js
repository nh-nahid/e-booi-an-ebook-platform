const Cart = require("../models/Cart");
const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const orderEmail = require("../emails/templates/orderEmail");
const Coupon = require("../models/Coupon");
const path = require("path");

// order create
async function createOrder(req, res, next) {
  try {
    const {
      shippingAddress,
      paymentMethod,
      couponCode,
    } = req.body;

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
    if (paymentMethod === "cod" && hasDigital) {
      return res.status(400).json({
        message:
          "Cash on Delivery is not allowed for Digital books",
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

      if (
        coupon.usageLimit > 0 &&
        coupon.usedCount >= coupon.usageLimit
      ) {
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
        discountAmount =
          (totalAmount * coupon.value) / 100;
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
      paymentMethod,

      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await order.save();

    // Reduce stock
    for (const item of cartItems) {
      if (item.book.bookType === "Physical") {
        item.book.stock -= item.quantity;
        await item.book.save();
      }
    }

    // Clear cart
    await Cart.deleteMany({
      user: req.user.id,
    });

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

// admin get all orders
async function getOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.book");

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// update order status
async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: req.body.orderStatus,
      },
      {
        new: true,
      },
    );

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

    const books = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.book.bookType === "Digital") {
          books.push(item.book);
        }
      });
    });

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
        if (
            order.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
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
    order.invoiceUrl.replace(/^\//, "")
);

        res.download(filePath);
    } catch (error) {
        next(error);
    }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  downloadBook,
  updatePaymentStatus,
  getLibrary,
  downloadInvoice
};
