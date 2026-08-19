const express = require("express");

const {
    addBook,
    getBooks,
    getBook,
    getBookPreview,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");

const {
    checkLogin,
    requireRole,
} = require("../middlewares/common/checkLogin");

const bookUpload = require("../middlewares/books/bookUpload");

const router = express.Router();

// public routes
router.get("/", getBooks);
router.get("/:id", getBook);
router.get("/:id/preview", getBookPreview);

// admin routes
router.post(
    "/",
    checkLogin,
    requireRole("admin"),
    bookUpload,
    addBook
);

router.put(
    "/:id",
    checkLogin,
    requireRole("admin"),
    bookUpload,
    updateBook
);

router.delete(
    "/:id",
    checkLogin,
    requireRole("admin"),
    deleteBook
);

module.exports = router;
