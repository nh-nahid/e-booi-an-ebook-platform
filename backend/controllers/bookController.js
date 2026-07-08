const Book = require("../models/Book");


// add book
async function addBook(req, res, next) {
    try {
        const coverImage = req.files.coverImage[0].filename;
        const pdfFile = req.files.pdfFile[0].filename;

        const book = new Book({
            ...req.body,
            coverImage,
            pdfFile,
            uploadedBy: req.user.id,
        });

        await book.save();

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
      sort = "newest",
    } = req.query;

    const query = {};

    // Search by title, author or category
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

    // Category filter
    if (category) {
      query.category = category;
    }

    // Digital / Physical
    if (bookType) {
      query.bookType = bookType;
    }

    // Published / Draft
    if (status) {
      query.isPublished = status === "published";
    }

    // Sorting
    let sortOption = { createdAt: -1 };

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

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      books,
    });
  } catch (error) {
    next(error);
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

        if (req.files?.coverImage) {
            req.body.coverImage =
                req.files.coverImage[0].filename;
        }

        if (req.files?.pdfFile) {
            req.body.pdfFile =
                req.files.pdfFile[0].filename;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.json({
            message: "Book updated successfully",
            data: updatedBook,
        });
    } catch (error) {
        next(error);
    }
}

// delete book
async function deleteBook(req, res, next) {
    try {
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
    deleteBook
}