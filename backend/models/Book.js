const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Pre-discount "MRP" shown struck-through next to price on the storefront.
    // Optional — a discount badge only renders when this is set and higher
    // than price (see book-hero.tsx's hasDiscount check).
    originalPrice: {
      type: Number,
      default: null,
    },
    // Cloudinary secure_url for the cover image.
    coverImage: {
      type: String,
      required: true,
    },
    // Cloudinary public_id for coverImage — needed to delete/replace the
    // asset on Cloudinary later (update/delete). Null for any book
    // created before the Cloudinary migration until it's backfilled by
    // scripts/migrate-assets-to-cloudinary.js.
    coverImagePublicId: {
      type: String,
      default: null,
    },
    // eBooi is a Digital-only platform now — enum kept (rather than
    // dropped) so the admin "Book Type" selector still has a field to
    // bind to, just with a single allowed value.
    bookType: {
      type: String,
      enum: ["Digital"],
      default: "Digital",
      required: true,
    },
    // Cloudinary secure_url for the full book PDF.
    pdfFile: {
      type: String,
      required: function () {
        return this.bookType === "Digital";
      },
    },
    // Cloudinary public_id for pdfFile (resource_type "raw").
    pdfFilePublicId: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    averageRating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPreOrder: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    // Incremented every time the public book-detail endpoint is hit.
    // Powers the "views" stat shown on the book detail page.
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Book", bookSchema);
