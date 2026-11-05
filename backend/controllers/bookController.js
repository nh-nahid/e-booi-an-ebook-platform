const Book = require("../models/Book");
const path = require("path");
const { destroyAsset } = require("../utils/cloudinary");
const { notifyAll } = require("../utils/notify");
const Category = require("../models/Category");
const { ensureCategory } = require("./categoryController");

// Tell every user about a newly published book (fire-and-forget: a failure
// here must never fail the admin's save).
function announceBook(book) {
  const pre = book.isPreOrder;
  notifyAll({
    type: "announcement",
    title: pre ? "নতুন বই প্রি-অর্ডারে" : "নতুন বই প্রকাশিত হয়েছে",
    message: `${book.title}${book.author ? " — " + book.author : ""}`,
    link: `/books/${book._id}`,
  }).catch((e) => console.log("Book notification failed:", e.message));
}

const isTrue = (v) => v === true || v === "true";
const {
  getOrCreatePreview,
  removePreview,
} = require("../utils/generateBookPreview");

// add book
async function addBook(req, res, next) {
  try {
    // bookUpload.js (Cloudinary storage) sets .path to the secure_url and
    // .filename to the Cloudinary public_id for each uploaded file.
    const coverFile = req.files?.coverImage?.[0];
    const pdfFileUpload = req.files?.pdfFile?.[0];

    const coverImage = coverFile?.path || null;
    const coverImagePublicId = coverFile?.filename || null;

    const pdfFile = pdfFileUpload?.path || null;
    const pdfFilePublicId = pdfFileUpload?.filename || null;

    const book = new Book({
      ...req.body,
      coverImage,
      coverImagePublicId,
      pdfFile,
      pdfFilePublicId,
      uploadedBy: req.user.id,
    });

    try {
      await ensureCategory(book.category);
      await book.save();
    } catch (error) {
      // rollback uploaded Cloudinary assets
      await destroyAsset(coverImagePublicId, "image");

      await destroyAsset(pdfFilePublicId, "raw");

      throw error;
    }

    if (book.isPublished) announceBook(book);

    res.status(201).json({
      message: "Book added successfully",
      data: book,
    });
  } catch (err) {
    next(err);
  }
}

// get all books
async function getBooks(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const {
      search,
      category,
      bookType,
      status,
      minPrice,
      maxPrice,
      featured,
      preOrder,
      sort = "newest",
    } = req.query;

    const query = {};

    // Search
    if (search?.trim()) {
      const keyword = search.trim();

      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          author: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    // Multiple Category Filter
    if (category) {
      const categories = category.split(",");

      query.category = {
        $in: categories,
      };
    }

    // Book Type
    if (bookType) {
      query.bookType = bookType;
    }

    // Featured Books
    if (featured === "true") {
      query.isFeatured = true;
    }

    if (preOrder === "true") {
      query.isPreOrder = true;
    }

    // Publish Status
    if (status) {
      query.isPublished = status === "published";
    }

    // Price Range
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "latest":
      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "price-low":
        sortOption = {
          price: 1,
        };
        break;

      case "price-high":
        sortOption = {
          price: -1,
        };
        break;

      case "title":
        sortOption = {
          title: 1,
        };
        break;

      case "best-selling":
        sortOption = {
          sold: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }

    const [books, total, categories] = await Promise.all([
      Book.find(query).sort(sortOption).skip(skip).limit(limit),

      Book.countDocuments(query),

      Category.find().sort({ order: 1, createdAt: 1 }).then((cs) => cs.map((c) => c.name)),
    ]);

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: {
        books,
        categories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

// get single book
async function getBook(req, res, next) {
  try {
    // $inc the view counter and return the updated doc in one round trip —
    // every detail-page hit counts as a view.
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1,
        },
      },
      {
        returnDocument: "after",
      },
    ).populate("uploadedBy", "name");

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      message: "Book fetched successfully",
      data: book,
    });
  } catch (err) {
    next(err);
  }
}

// get a short (first few pages) preview PDF for a Digital book — public,
// no purchase required. Only ever serves a freshly-trimmed copy, never
// the full pdfFile, so a shopper can sample the book without being able
// to read/download the whole thing for free.
async function getBookPreview(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    if (book.bookType !== "Digital" || !book.pdfFile) {
      return res.status(404).json({
        message: "Preview not available for this book",
      });
    }

    const previewPath = await getOrCreatePreview(book);

    if (!previewPath) {
      return res.status(404).json({
        message: "Preview not available for this book",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `inline; filename="preview-${book._id}.pdf"`,
    );
    res.type("application/pdf");

    res.sendFile(path.resolve(previewPath));
  } catch (err) {
    next(err);
  }
}

// update book
async function updateBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    let oldCoverPublicId;
    let oldPdfPublicId;

    if (req.files?.coverImage) {
      oldCoverPublicId = book.coverImagePublicId;

      req.body.coverImage = req.files.coverImage[0].path;
      req.body.coverImagePublicId = req.files.coverImage[0].filename;
    }

    if (req.files?.pdfFile) {
      oldPdfPublicId = book.pdfFilePublicId;

      req.body.pdfFile = req.files.pdfFile[0].path;
      req.body.pdfFilePublicId = req.files.pdfFile[0].filename;
    }

    const wasPublished = book.isPublished;

    await ensureCategory(req.body.category);

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    // remove old Cloudinary assets after a successful update

    if (oldCoverPublicId) {
      await destroyAsset(oldCoverPublicId, "image");
    }

    if (oldPdfPublicId) {
      await destroyAsset(oldPdfPublicId, "raw");
      // the cached preview was built from the old pdfFile — drop it so
      // the next preview request rebuilds from the new one.
      removePreview(book._id);
    }

    // draft -> published transition: announce it
    if (!wasPublished && updatedBook?.isPublished && isTrue(req.body.isPublished)) {
      announceBook(updatedBook);
    }

    res.json({
      message: "Book updated successfully",

      data: updatedBook,
    });
  } catch (error) {
    // remove newly uploaded Cloudinary assets if the update failed

    if (req.files?.coverImage) {
      await destroyAsset(req.files.coverImage[0].filename, "image");
    }

    if (req.files?.pdfFile) {
      await destroyAsset(req.files.pdfFile[0].filename, "raw");
    }

    next(error);
  }
}

// delete book
async function deleteBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // delete Cloudinary assets

    await destroyAsset(book.coverImagePublicId, "image");

    await destroyAsset(book.pdfFilePublicId, "raw");

    removePreview(book._id);

    // delete database record

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addBook,
  getBooks,
  getBook,
  getBookPreview,
  updateBook,
  deleteBook,
};
