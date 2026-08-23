const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        type: {
            type: String,
            enum: ["fixed", "percentage"],
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        minimumAmount: {
            type: Number,
            default: 0,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        usageLimit: {
            type: Number,
            default: 0,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // When non-empty, only these emails (case-insensitive) may apply
        // this coupon. Empty array = open to everyone (default behaviour
        // for normal coupons). Used for restricted/secret codes like EB100.
        allowedEmails: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Coupon", couponSchema);