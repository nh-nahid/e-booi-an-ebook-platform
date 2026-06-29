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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Coupon", couponSchema);