const mongoose = require("mongoose");

// ebooi sells the work of a single author, so this is a singleton document.
const authorProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: "", trim: true },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AuthorProfile", authorProfileSchema);
