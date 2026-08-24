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
    coverImage: {
      type: String,
      required: true,
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
    pdfFile: {
      type: String,
      required: function () {
        return this.bookType === "Digital";
      },
    },
    stock: {
      type: Number,
      default: 1,
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
