const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    planName: { type: String, default: "" },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    // active: usable until expiresAt | revoked: removed by an admin
    status: { type: String, enum: ["active", "revoked"], default: "active" },
    source: { type: String, enum: ["purchase", "admin"], default: "purchase" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
