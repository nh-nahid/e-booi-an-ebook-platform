const Category = require("../models/Category");
const Book = require("../models/Book");

// First use: turn the category strings already on books into Category docs.
async function seedIfEmpty() {
  if ((await Category.countDocuments()) > 0) return;
  const names = (await Book.distinct("category")).filter(Boolean);
  if (names.length) {
    await Category.insertMany(
      names.map((name, i) => ({ name, order: i })),
      { ordered: false },
    ).catch(() => {});
  }
}

async function withCounts(categories) {
  const counts = await Book.aggregate([
    { $group: { _id: "$category", n: { $sum: 1 } } },
  ]);
  const map = new Map(counts.map((c) => [c._id, c.n]));
  return categories.map((c) => ({ ...c.toObject(), booksCount: map.get(c.name) || 0 }));
}

async function listCategories(req, res, next) {
  try {
    await seedIfEmpty();
    const cats = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json({ data: await withCounts(cats) });
  } catch (e) {
    next(e);
  }
}

async function createCategory(req, res, next) {
  try {
    const name = (req.body.name || "").trim();
    if (!name) return res.status(400).json({ message: "Category name is required" });
    if (await Category.findOne({ name })) {
      return res.status(409).json({ message: "এই নামে একটি ক্যাটেগরি আছে" });
    }
    const last = await Category.findOne().sort({ order: -1 });
    const cat = await Category.create({
      name,
      description: req.body.description || "",
      image: req.body.image || "",
      order: (last?.order ?? -1) + 1,
    });
    res.status(201).json({ data: cat });
  } catch (e) {
    next(e);
  }
}

// Renaming also renames the category on every book that uses it.
async function updateCategory(req, res, next) {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const name = req.body.name !== undefined ? String(req.body.name).trim() : cat.name;
    if (!name) return res.status(400).json({ message: "Category name is required" });
    if (name !== cat.name) {
      if (await Category.findOne({ name, _id: { $ne: cat._id } })) {
        return res.status(409).json({ message: "এই নামে একটি ক্যাটেগরি আছে" });
      }
      await Book.updateMany({ category: cat.name }, { category: name });
      cat.name = name;
    }
    if (req.body.description !== undefined) cat.description = req.body.description;
    if (req.body.image !== undefined) cat.image = req.body.image;
    await cat.save();
    res.json({ data: cat });
  } catch (e) {
    next(e);
  }
}

async function reorderCategories(req, res, next) {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    await Promise.all(ids.map((id, i) => Category.findByIdAndUpdate(id, { order: i })));
    res.json({ message: "Order saved" });
  } catch (e) {
    next(e);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    const used = await Book.countDocuments({ category: cat.name });
    if (used > 0) {
      return res.status(400).json({
        message: `এই ক্যাটেগরিতে ${used}টি বই আছে। আগে বইগুলো অন্য ক্যাটেগরিতে সরান।`,
      });
    }
    await cat.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (e) {
    next(e);
  }
}

// Used by book create/update so a typed-in category always exists.
async function ensureCategory(name) {
  if (!name) return;
  const exists = await Category.findOne({ name });
  if (exists) return;
  const last = await Category.findOne().sort({ order: -1 });
  await Category.create({ name, order: (last?.order ?? -1) + 1 }).catch(() => {});
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  reorderCategories,
  deleteCategory,
  ensureCategory,
};
