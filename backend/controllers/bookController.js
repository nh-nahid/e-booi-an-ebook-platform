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

    const { search, category, bookType, status, sort = "newest" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) query.category = category;

    if (bookType) query.bookType = bookType;

    if (status) query.isPublished = status === "published";

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "price-low":
        sortOption = { price: 1 };
        break;

      case "price-high":
        sortOption = { price: -1 };
        break;

      case "title":
        sortOption = { title: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      books,
    });
  } catch (err) {
    next(err);
  }
}

// get single book
async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
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
