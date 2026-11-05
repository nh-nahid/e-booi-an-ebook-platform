// Seeds the catalogue: categories, sample books, subscription plans, author.
//
//   cd backend
//   node scripts/seed.js --yes                 # add/update sample data (keeps existing books)
//   node scripts/seed.js --yes --reset         # FIRST delete all books + related data, then seed
//
// --reset deletes: books, carts, wishlists, reviews, categories, plans,
// subscriptions. Users and orders are kept (order lines pointing at deleted
// books simply disappear from library/order screens).
//
// Safety: nothing runs without --yes. When NODE_ENV=production (or the URL
// looks like Atlas) --reset also needs --i-know-this-is-production.
//
// Cover/PDF files live in backend/public/seed and are served by the backend at
// <SEED_ASSET_BASE | PAYMENT/BACKEND_URL>/seed/<slug>.jpg|pdf.

require("dotenv").config();
const mongoose = require("mongoose");

const Book = require("../models/Book");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const Review = require("../models/Review");
const Category = require("../models/Category");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const AuthorProfile = require("../models/AuthorProfile");
const User = require("../models/User");
const { CATEGORIES, BOOKS, PLANS, AUTHOR } = require("./seed-data");

const args = new Set(process.argv.slice(2));

async function run() {
  const uri = process.env.MONGO_CONNECTION_STRING;
  if (!uri) throw new Error("MONGO_CONNECTION_STRING is not set");

  if (!args.has("--yes")) {
    console.log("Dry run. Re-run with --yes to write to the database (add --reset to wipe books first).");
    return;
  }
  const looksProd = process.env.NODE_ENV === "production" || /mongodb\+srv/.test(uri);
  if (args.has("--reset") && looksProd && !args.has("--i-know-this-is-production")) {
    throw new Error("--reset on a production-looking database needs --i-know-this-is-production");
  }

  const base = (process.env.SEED_ASSET_BASE || process.env.BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

  await mongoose.connect(uri);
  console.log("Connected to", mongoose.connection.host);

  if (args.has("--reset")) {
    const r = await Promise.all([
      Book.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      Review.deleteMany({}),
      Category.deleteMany({}),
      Plan.deleteMany({}),
      Subscription.deleteMany({}),
    ]);
    console.log("Reset: deleted", r.map((x) => x.deletedCount).join(" / "), "(books/carts/wishlists/reviews/categories/plans/subscriptions)");
  }

  for (const [i, c] of CATEGORIES.entries()) {
    await Category.findOneAndUpdate({ name: c.name }, { ...c, order: i }, { upsert: true, setDefaultsOnInsert: true });
  }

  const admin = await User.findOne({ role: "admin" }).select("_id");
  for (const b of BOOKS) {
    const doc = {
      title: b.title,
      author: AUTHOR.name,
      description: b.desc,
      category: b.category,
      price: b.price,
      originalPrice: b.originalPrice ?? null,
      coverImage: `${base}/seed/${b.slug}.jpg`,
      pdfFile: `${base}/seed/${b.slug}.pdf`,
      bookType: "Digital",
      isPublished: true,
      isFeatured: !!b.featured,
      isPreOrder: !!b.preOrder,
      uploadedBy: admin?._id,
    };
    await Book.findOneAndUpdate({ title: b.title }, doc, { upsert: true, setDefaultsOnInsert: true });
  }

  for (const p of PLANS) {
    await Plan.findOneAndUpdate({ name: p.name }, { ...p, isActive: true }, { upsert: true, setDefaultsOnInsert: true });
  }

  if (!(await AuthorProfile.findOne())) await AuthorProfile.create(AUTHOR);

  console.log(
    `Seeded ${CATEGORIES.length} categories, ${BOOKS.length} books, ${PLANS.length} plans.`,
    "Files are served from", `${base}/seed/`,
  );
}

run()
  .catch((e) => {
    console.error("Seed failed:", e.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
