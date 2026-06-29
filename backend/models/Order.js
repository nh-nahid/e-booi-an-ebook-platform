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
          enum: ["physical", "digital"],
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
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

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz", "stripe"],
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
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
