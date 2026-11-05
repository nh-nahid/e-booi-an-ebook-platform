const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },

        quantity: {
          type: Number,
          default: 1,
        },

        price: Number,

        bookType: {
          type: String,
          enum: ["Digital"],
          default: "Digital",
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // Set when the order buys a subscription plan instead of books.
    subscriptionPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },

    // true when these items were pulled from the user's Cart (normal
    // checkout). false for a direct "buy now" order placed straight from
    // a book page — those items never touched the Cart collection, so
    // the cart must NOT be cleared once this order is paid/placed.
    fromCart: {
      type: Boolean,
      default: true,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // "cod" (Cash on Delivery) was only ever used for Physical book
    // shipping and is removed now that ebooi is Digital-only.
    paymentMethod: {
      type: String,
      // "sslcommerz" and "stripe" are legacy values kept only so older orders
      // still validate when saved. New orders are always "eps".
      enum: ["sslcommerz", "stripe", "eps"],
      required: true,
    },

    // Unique id sent to EPS on each payment attempt; used to find the order
    // again when EPS redirects the shopper back.
    // Which client placed the order. EPS sends the shopper back to our
    // backend, which then forwards them to the website or, for the mobile
    // app, to its deep link (ebooi://...).
    source: {
      type: String,
      enum: ["web", "mobile"],
      default: "web",
    },

    epsMerchantTransactionId: {
      type: String,
      default: null,
      index: true,
    },

    transactionId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
    invoiceNumber: {
      type: String,
    },

    invoiceUrl: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
