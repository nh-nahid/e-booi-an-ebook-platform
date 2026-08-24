// One-time migration — uploads every asset that's still stored locally
// (book covers, book PDFs, user avatars) to Cloudinary, and updates each
// DB document with the new secure_url + public_id.
//
// Safe to re-run: any record whose coverImage/pdfFile/avatar already
// starts with "http" is treated as already migrated and skipped, so
// running this twice (or after uploading a few new books through the
// Cloudinary-backed admin form) won't re-upload or duplicate anything.
//
// Run from the backend folder, with CLOUDINARY_* filled in in .env and a
// working DB connection:
//   node scripts/migrate-assets-to-cloudinary.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const { cloudinary, ROOT_FOLDER } = require("../utils/cloudinary");
const Book = require("../models/Book");
const User = require("../models/User");

function isAlreadyMigrated(value) {
  return typeof value === "string" && value.startsWith("http");
}

async function uploadLocalFile(localPath, options) {
  if (!fs.existsSync(localPath)) {
    return null;
  }

  const result = await cloudinary.uploader.upload(localPath, options);

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

async function migrateBooks() {
  const books = await Book.find({});

  let coversUploaded = 0;
  let pdfsUploaded = 0;
  let skipped = 0;

  for (const book of books) {
    let changed = false;

    if (book.coverImage && !isAlreadyMigrated(book.coverImage)) {
      const localPath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "books",
        book.coverImage,
      );

      const uploaded = await uploadLocalFile(localPath, {
        folder: `${ROOT_FOLDER}/books/covers`,
        resource_type: "image",
      });

      if (uploaded) {
        book.coverImage = uploaded.url;
        book.coverImagePublicId = uploaded.publicId;
        changed = true;
        coversUploaded += 1;
        console.log(`Cover uploaded for "${book.title}"`);
      } else {
        console.log(
          `Skipped cover for "${book.title}" — local file not found: ${localPath}`,
        );
      }
    }

    if (book.pdfFile && !isAlreadyMigrated(book.pdfFile)) {
      const localPath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "pdfs",
        book.pdfFile,
      );

      const uploaded = await uploadLocalFile(localPath, {
        folder: `${ROOT_FOLDER}/books/pdfs`,
        resource_type: "raw",
        format: "pdf",
      });

      if (uploaded) {
        book.pdfFile = uploaded.url;
        book.pdfFilePublicId = uploaded.publicId;
        changed = true;
        pdfsUploaded += 1;
        console.log(`PDF uploaded for "${book.title}"`);
      } else {
        console.log(
          `Skipped PDF for "${book.title}" — local file not found: ${localPath}`,
        );
      }
    }

    if (changed) {
      await book.save();
    } else {
      skipped += 1;
    }
  }

  console.log(
    `Books: ${coversUploaded} cover(s) and ${pdfsUploaded} pdf(s) uploaded, ${skipped} book(s) already migrated/untouched.`,
  );
}

async function migrateAvatars() {
  const users = await User.find({ avatar: { $ne: null } });

  let uploaded = 0;
  let skipped = 0;

  for (const user of users) {
    if (!user.avatar || isAlreadyMigrated(user.avatar)) {
      skipped += 1;
      continue;
    }

    const localPath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      "avatars",
      user.avatar,
    );

    const result = await uploadLocalFile(localPath, {
      folder: `${ROOT_FOLDER}/avatars`,
      resource_type: "image",
    });

    if (result) {
      user.avatar = result.url;
      user.avatarPublicId = result.publicId;
      await user.save();
      uploaded += 1;
      console.log(`Avatar uploaded for "${user.name}"`);
    } else {
      console.log(
        `Skipped avatar for "${user.name}" — local file not found: ${localPath}`,
      );
    }
  }

  console.log(`Avatars: ${uploaded} uploaded, ${skipped} already migrated/skipped.`);
}

async function run() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      "CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not set in .env — fill those in first.",
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  console.log("Connected to database.");

  await migrateBooks();
  await migrateAvatars();

  console.log("Migration complete.");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
