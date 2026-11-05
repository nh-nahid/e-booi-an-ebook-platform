// Restores the categories that disappeared after cleanup-physical-books.js
// deleted their only books (উসূলুল ঈমান, প্যাসিভ ইনকাম, ডোন্ট কল ইট আর্ট were
// the last Physical books in these 3 categories — since the homepage builds
// its category list from whatever categories still have at least one Book
// document, deleting those books made the categories vanish too).
//
// This inserts one clearly-marked PLACEHOLDER Digital book per lost
// category, just so the category shows up again. It is NOT a real,
// purchasable book (price ৳0, unpublished, obvious placeholder title).
//
// IMPORTANT — please do one of these soon for each category:
//   a) Edit the placeholder in the admin panel into a real book
//      (title, author, price, cover, PDF), or
//   b) Add a real book to that category, then delete the placeholder.
//
// Run from the backend folder, with a working DB connection:
//   node scripts/restore-lost-categories.js
//
// Safe to re-run — it only creates a placeholder for a category that
// currently has zero books; a category that already has any book (real
// or placeholder) is skipped.

require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/Book");

const LOST_CATEGORIES = ["ইসলামিক বই", "কর্ম ও জীবিকা", "সাহিত্য"];

async function run() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Connected to database.");

  for (const category of LOST_CATEGORIES) {
    const existing = await Book.findOne({ category });

    if (existing) {
      console.log(`Skipped "${category}" — already has a book ("${existing.title}").`);
      continue;
    }

    const placeholder = await Book.create({
      title: `[প্লেসহোল্ডার] ${category} — শীঘ্রই আসল বই যোগ হবে`,
      author: "ebooi",
      description:
        "এটি একটি অস্থায়ী প্লেসহোল্ডার বই — শুধু এই ক্যাটাগরিটি সাইটে দেখানোর জন্য যোগ করা হয়েছে। " +
        "অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে এটি সম্পাদনা করে একটি প্রকৃত বই দিয়ে প্রতিস্থাপন করুন, " +
        "অথবা এই ক্যাটাগরিতে নতুন বই যোগ করার পর এই এন্ট্রিটি মুছে ফেলুন।",
      category,
      price: 0,
      coverImage: "placeholder-cover.jpg",
      bookType: "Digital",
      pdfFile: "placeholder.pdf",
      stock: 0,
      isPublished: false,
      isFeatured: false,
      isPreOrder: false,
    });

    console.log(`Created placeholder for "${category}": ${placeholder._id}`);
  }

  console.log("Done — the lost categories should reappear on the homepage.");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Restore failed:", error);
  process.exit(1);
});
