// One-time (or rerun-anytime) script to create/update the EB100 secret
// 100%-discount coupon in the live database. This code only exists locally
// on the backend server — it must be RUN from a machine that has a working
// connection to the MongoDB Atlas cluster:
//
//   cd backend
//   node scripts/seed-eb100-coupon.js
//
// To add more "special users" later, add their email to ALLOWED_EMAILS
// below and run this script again — it's idempotent (upsert), so it will
// just update the existing EB100 document instead of creating a duplicate.

require("dotenv").config();
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");

const ALLOWED_EMAILS = [
  "nahiddev4@gmail.com",
  // "another-special-user@example.com",
];

async function run() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Connected to database.");

  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const coupon = await Coupon.findOneAndUpdate(
    { code: "EB100" },
    {
      code: "EB100",
      type: "percentage",
      value: 100,
      minimumAmount: 0,
      expiryDate,
      usageLimit: 0, // unlimited uses — access is controlled by allowedEmails, not a count
      isActive: true,
      allowedEmails: ALLOWED_EMAILS,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("EB100 coupon is ready:");
  console.log(coupon);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Failed to seed EB100 coupon:", error);
  process.exit(1);
});
