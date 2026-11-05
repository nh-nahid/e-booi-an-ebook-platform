const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

async function activeSubscriptions(userId) {
  return Subscription.find({
    user: userId,
    status: "active",
    expiresAt: { $gt: new Date() },
  })
    .populate("plan", "name scope categories")
    .sort({ expiresAt: -1 });
}

async function activeSubscription(userId) {
  return (await activeSubscriptions(userId))[0] || null;
}

async function purchasedBookIds(userId) {
  const orders = await Order.find({ user: userId, paymentStatus: "paid" }).select("items.book");
  const ids = new Set();
  orders.forEach((o) => o.items.forEach((i) => i.book && ids.add(i.book.toString())));
  return ids;
}

// Every book the user may read: purchases + admin grants (+ all published
// books while a subscription is active) minus anything an admin revoked.
async function libraryBooks(userId) {
  const user = await User.findById(userId).select("grantedBooks revokedBooks");
  const revoked = new Set((user?.revokedBooks || []).map(String));
  const subs = await activeSubscriptions(userId);

  // Purchases and admin grants always apply.
  const ids = await purchasedBookIds(userId);
  (user?.grantedBooks || []).forEach((id) => ids.add(id.toString()));

  // Subscriptions add either every book or the books of the plan's categories.
  const base = { isPublished: true, bookType: "Digital" };
  const or = [{ _id: { $in: [...ids] } }];
  let all = false;
  const cats = new Set();
  subs.forEach((s) => {
    if (!s.plan || s.plan.scope === "all") all = true;
    else s.plan.categories.forEach((c) => cats.add(c));
  });
  if (all) or.push(base);
  else if (cats.size) or.push({ ...base, category: { $in: [...cats] } });

  const books = await Book.find({ $or: or, bookType: "Digital" });
  return books.filter((b) => !revoked.has(b._id.toString()));
}

async function hasBookAccess(userId, bookId) {
  const books = await libraryBooks(userId);
  return books.find((b) => b._id.toString() === String(bookId)) || null;
}

module.exports = { activeSubscriptions, activeSubscription, purchasedBookIds, libraryBooks, hasBookAccess };
