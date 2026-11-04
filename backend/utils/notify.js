const Notification = require("../models/Notification");
const User = require("../models/User");

// Notifications must never break the flow that triggers them
// (a payment, an order...), so every helper swallows its own errors.
async function notifyUser(userId, { type = "announcement", title, message = "", link = "" }) {
  try {
    await Notification.create({ user: userId, type, title, message, link });
  } catch (error) {
    console.log("Notification failed:", error.message);
  }
}

async function notifyAll({ type = "announcement", title, message = "", link = "" }) {
  const users = await User.find({}, "_id").lean();
  if (!users.length) return 0;
  await Notification.insertMany(
    users.map((u) => ({ user: u._id, type, title, message, link })),
  );
  return users.length;
}

module.exports = { notifyUser, notifyAll };
