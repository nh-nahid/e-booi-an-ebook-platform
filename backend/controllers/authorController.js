const AuthorProfile = require("../models/AuthorProfile");

async function getAuthor(req, res, next) {
  try {
    const author = await AuthorProfile.findOne();
    res.json({ data: author });
  } catch (e) {
    next(e);
  }
}

async function saveAuthor(req, res, next) {
  try {
    const fields = ["name", "tagline", "bio", "photo", "facebook", "youtube", "website"];
    const update = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    if (!update.name && !(await AuthorProfile.findOne())) {
      return res.status(400).json({ message: "লেখকের নাম দিন" });
    }
    const author = await AuthorProfile.findOneAndUpdate({}, update, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    res.json({ data: author });
  } catch (e) {
    next(e);
  }
}

module.exports = { getAuthor, saveAuthor };
