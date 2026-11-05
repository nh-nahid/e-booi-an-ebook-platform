const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

async function activeSubscription(userId) {
  return Subscription.findOne({
    user: userId,
    status: "active",
    expiresAt: { $gt: new Date() },
  }).sort({ expiresAt: -1 });
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
  const sub = await activeSubscription(userId);

  let books;
  if (sub) {
    books = await Book.find({ isPublished: true, bookType: "Digital" });
  } else {
    const ids = await purchasedBookIds(userId);
    (user?.grantedBooks || []).forEach((id) => ids.add(id.toString()));
    books = await Book.find({ _id: { $in: [...ids] }, bookType: "Digital" });
  }
  // Admin grants always apply, even when not otherwise visible.
  if (sub && user?.grantedBooks?.length) {
    const have = new Set(books.map((b) => b._id.toString()));
    const extra = user.grantedBooks.filter((id) => !have.has(id.toString()));
    if (extra.length) books = books.concat(await Book.find({ _id: { $in: extra } }));
  }
  return books.filter((b) => !revoked.has(b._id.toString()));
}

async function hasBookAccess(userId, bookId) {
  const books = await libraryBooks(userId);
  return books.find((b) => b._id.toString() === String(bookId)) || null;
}

module.exports = { activeSubscription, purchasedBookIds, libraryBooks, hasBookAccess };
