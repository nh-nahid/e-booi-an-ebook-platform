const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate entries
cartSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);