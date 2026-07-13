const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");

// delete uploaded file helper
function removeFile(folder, filename) {
  if (!filename) return;

  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    folder,
    filename,
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// add book
async function addBook(req, res, next) {
  try {
    const coverImage = req.files?.coverImage?.[0]?.filename || null;

    const pdfFile = req.files?.pdfFile?.[0]?.filename || null;

    const book = new Book({
      ...req.body,
      coverImage,
      pdfFile,
      uploadedBy: req.user.id,
    });

    try {
      await book.save();
    } catch (error) {
      // rollback uploaded files
      removeFile("books", coverImage);

      removeFile("pdfs", pdfFile);

      throw error;
    }

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

      Book.distinct("category"),
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
    const book = await Book.findById(req.params.id).populate(
      "uploadedBy",
      "name",
    );

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

// update book
async function updateBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    let oldCover;
    let oldPdf;

    if (req.files?.coverImage) {
      oldCover = book.coverImage;

      req.body.coverImage = req.files.coverImage[0].filename;
    }

    if (req.files?.pdfFile) {
      oldPdf = book.pdfFile;

      req.body.pdfFile = req.files.pdfFile[0].filename;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // remove old files after successful update

    if (oldCover) {
      removeFile("books", oldCover);
    }

    if (oldPdf) {
      removeFile("pdfs", oldPdf);
    }

    res.json({
      message: "Book updated successfully",

      data: updatedBook,
    });
  } catch (error) {
    // remove newly uploaded files if update fails

    if (req.files?.coverImage) {
      removeFile("books", req.files.coverImage[0].filename);
    }

    if (req.files?.pdfFile) {
      removeFile("pdfs", req.files.pdfFile[0].filename);
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

    // delete files

    removeFile("books", book.coverImage);

    removeFile("pdfs", book.pdfFile);

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
  updateBook,
  deleteBook,
};
