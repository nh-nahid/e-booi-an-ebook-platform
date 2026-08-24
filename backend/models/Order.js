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
    // shipping and is removed now that eBooi is Digital-only.
    paymentMethod: {
      type: String,
      enum: ["sslcommerz", "stripe"],
      required: true,
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
