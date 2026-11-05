const User = require("../models/User");
const Book = require("../models/Book");
const Subscription = require("../models/Subscription");
const { purchasedBookIds, libraryBooks } = require("../utils/access");

// Everything an admin needs to manage one user's content.
async function getUserContent(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select("name email grantedBooks revokedBooks");
    if (!user) return res.status(404).json({ message: "User not found" });

    const [purchased, library, subs] = await Promise.all([
      purchasedBookIds(user._id),
      libraryBooks(user._id),
      Subscription.find({ user: user._id }).sort({ createdAt: -1 }),
    ]);
    const granted = new Set(user.grantedBooks.map(String));
    const revoked = user.revokedBooks.map(String);
    const revokedBooks = await Book.find({ _id: { $in: revoked } }).select("title coverImage author");

    const books = library.map((b) => ({
      _id: b._id,
      title: b.title,
      author: b.author,
      coverImage: b.coverImage,
      via: purchased.has(b._id.toString())
        ? "purchase"
        : granted.has(b._id.toString())
          ? "grant"
          : "subscription",
    }));

    res.json({
      data: { user: { _id: user._id, name: user.name, email: user.email }, books, revokedBooks, subscriptions: subs },
    });
  } catch (e) {
    next(e);
  }
}

// Remove a book from the user's library (purchase stays on record).
async function revokeBook(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { revokedBooks: req.params.bookId },
      $pull: { grantedBooks: req.params.bookId },
    });
    res.json({ message: "Access removed" });
  } catch (e) {
    next(e);
  }
}

// Give a book for free, or restore a previously removed one.
async function grantBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { grantedBooks: book._id },
      $pull: { revokedBooks: book._id },
    });
    res.json({ message: "Access granted" });
  } catch (e) {
    next(e);
  }
}

module.exports = { getUserContent, revokeBook, grantBook };
