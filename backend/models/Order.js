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

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        shippingAddress: {
            fullName: String,
            phone: String,
            address: String,
            city: String,
            postalCode: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);