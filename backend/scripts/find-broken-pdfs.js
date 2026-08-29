// Diagnostic — lists every Digital book whose pdfFile is NOT a proper
// Cloudinary secure_url (i.e. doesn't start with "http"). These are the
// books that will fail to preview/read/download until their PDF is
// re-uploaded through the admin panel.
//
// Run from the backend folder, with a working DB connection:
//   node scripts/find-broken-pdfs.js

require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/Book");

async function run() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Connected to database.");

  const allDigital = await Book.find({ bookType: "Digital" }).select(
    "_id title pdfFile updatedAt",
  );

  const broken = allDigital.filter(
    (b) => !b.pdfFile || !b.pdfFile.startsWith("http"),
  );

  console.log(
    `Checked ${allDigital.length} Digital book(s). Found ${broken.length} with an invalid pdfFile:\n`,
  );

  broken.forEach((b) => {
    console.log(
      `- "${b.title}" (${b._id}) — pdfFile: "${b.pdfFile}" — last updated: ${b.updatedAt}`,
    );
  });

  if (broken.length === 0) {
    console.log("None — every Digital book has a proper Cloudinary URL.");
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Check failed:", error);
  process.exit(1);
});
