const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["order", "payment", "announcement"],
      default: "announcement",
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, default: "", trim: true, maxlength: 500 },
    // In-app path the notification opens, e.g. "/orders/<id>" (same on web and app).
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
