// One-time cleanup script — run this after deploying the Digital-only
// code changes, to purge old Physical-book data from the live database.
// ebooi has moved to a Digital-only (eBook) catalog: this removes
//   1) Cart items pointing at a Physical book (so nothing orphaned lingers)
//   2) Orders placed with "cod" (Cash on Delivery) — COD was only ever
//      usable for Physical books (the app blocked COD whenever a Digital
//      book was in the order), so every COD order is a Physical-book order
//   3) Book documents with bookType "Physical"
//
// This does NOT touch paid sslcommerz/card orders, even ones that
// historically included a physical book — those are real revenue/order
// history and are left alone. Only the Physical catalog itself and the
// COD-only order trail are removed.
//
// Run from the backend folder, with a working DB connection:
//   node scripts/cleanup-physical-books.js
//
// Safe to re-run — later runs will simply find 0 matching documents.

require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

async function run() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Connected to database.");

  const physicalBooks = await Book.find({ bookType: "Physical" }).select("_id title");
  const physicalBookIds = physicalBooks.map((b) => b._id);

  console.log(`Found ${physicalBooks.length} Physical book(s):`);
  physicalBooks.forEach((b) => console.log(`  - ${b.title} (${b._id})`));

  if (physicalBookIds.length > 0) {
    const cartResult = await Cart.deleteMany({ book: { $in: physicalBookIds } });
    console.log(`Removed ${cartResult.deletedCount} cart item(s) referencing Physical books.`);
  } else {
    console.log("No cart items to remove.");
  }

  const codOrdersResult = await Order.deleteMany({ paymentMethod: "cod" });
  console.log(`Removed ${codOrdersResult.deletedCount} COD order(s).`);

  const booksResult = await Book.deleteMany({ bookType: "Physical" });
  console.log(`Removed ${booksResult.deletedCount} Physical book(s) from the catalog.`);

  console.log("Cleanup complete — ebooi's catalog and order data are now Digital-only.");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Cleanup failed:", error);
  process.exit(1);
});
