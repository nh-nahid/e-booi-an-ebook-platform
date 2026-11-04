const Notification = require("../models/Notification");
const { notifyAll } = require("../utils/notify");

// GET /notifications  -> latest 50 + unread count
async function getNotifications(req, res, next) {
  try {
    const [items, unread] = await Promise.all([
      Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ user: req.user.id, isRead: false }),
    ]);
    res.status(200).json({ data: items, unread });
  } catch (error) {
    next(error);
  }
}

// PATCH /notifications/read-all
async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
}

// PATCH /notifications/:id/read
async function markRead(req, res, next) {
  try {
    const item = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { returnDocument: "after" },
    );
    if (!item) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
}

// DELETE /notifications/:id
async function removeNotification(req, res, next) {
  try {
    await Notification.deleteOne({ _id: req.params.id, user: req.user.id });
    res.status(200).json({ message: "Notification removed" });
  } catch (error) {
    next(error);
  }
}

// POST /admin/notifications  -> announcement to every user
async function broadcast(req, res, next) {
  try {
    const { title, message, link } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const count = await notifyAll({
      type: "announcement",
      title: String(title).trim(),
      message: message ? String(message).trim() : "",
      link: link ? String(link).trim() : "",
    });
    res.status(201).json({ message: "Announcement sent", recipients: count });
  } catch (error) {
    next(error);
  }
}

module.exports = { getNotifications, markAllRead, markRead, removeNotification, broadcast };
