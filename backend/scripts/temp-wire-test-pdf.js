// TEMPORARY / TESTING ONLY — points every Digital book that currently has
// a broken pdfFile at ONE existing Cloudinary PDF (found by
// list-cloudinary-pdfs.js), purely so preview/read/download can be
// verified end-to-end while the real book PDFs aren't available yet.
//
// This intentionally does NOT try to guess which of the 7 Cloudinary
// files "belongs" to which book — most of them are duplicate test
// uploads anyway (see list-cloudinary-pdfs.js output). Every affected
// book will show/serve the SAME placeholder PDF until its real file is
// re-uploaded through the admin panel.
//
// Delete this script (or at least don't re-run it) once real PDFs have
// been uploaded for these books — running it again after that would
// wipe a real pdfFile back to the test one for anything still matching
// the "isn't a proper URL" check, which by then should be nothing, but
// don't rely on that.
//
// Run from the backend folder:
//   node scripts/temp-wire-test-pdf.js

require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/Book");

const TEST_PDF_URL =
  "https://res.cloudinary.com/wtgepkfi/raw/upload/v1787563559/ebooi/books/pdfs/kgrr2bnco1y7qnurozdf.pdf";
const TEST_PDF_PUBLIC_ID = "ebooi/books/pdfs/kgrr2bnco1y7qnurozdf";

async function run() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Connected to database.");

  const broken = await Book.find({
    bookType: "Digital",
    pdfFile: { $not: /^http/ },
  });

  console.log(`Found ${broken.length} book(s) with a broken pdfFile.\n`);

  for (const book of broken) {
    book.pdfFile = TEST_PDF_URL;
    book.pdfFilePublicId = TEST_PDF_PUBLIC_ID;
    await book.save();
    console.log(`Wired test PDF onto "${book.title}" (${book._id})`);
  }

  console.log(
    "\nDone. These books will all serve the SAME placeholder PDF for " +
      "preview/read/download until their real files are re-uploaded via " +
      "the admin panel.",
  );

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
