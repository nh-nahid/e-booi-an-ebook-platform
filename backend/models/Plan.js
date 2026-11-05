const mongoose = require("mongoose");

// A subscription plan unlocks every published digital book for
// `durationDays` after purchase.
const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    // "all" = every published book; "categories" = only books in the listed
    // categories (series), e.g. a plan for one series.
    scope: { type: String, enum: ["all", "categories"], default: "all" },
    categories: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Plan", planSchema);
