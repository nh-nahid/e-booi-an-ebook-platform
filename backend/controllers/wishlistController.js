const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

// Get wishlist
async function getWishlist(req, res, next) {
    try {
        const wishlist = await Wishlist.find({
            user: req.user.id,
        })
            .populate("book")
            .sort({ createdAt: -1 });

        res.status(200).json({
            data: wishlist,
        });
    } catch (error) {
        next(error);
    }
}

// Add to wishlist
async function addToWishlist(req, res, next) {
    try {
        const { bookId } = req.body;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        const exists = await Wishlist.findOne({
            user: req.user.id,
            book: bookId,
        });

        if (exists) {
            return res.status(400).json({
                message:
                    "Book already in wishlist",
            });
        }

        const wishlist = new Wishlist({
            user: req.user.id,
            book: bookId,
        });

        await wishlist.save();

        res.status(201).json({
            message: "Added to wishlist",
            wishlist,
        });
    } catch (error) {
        next(error);
    }
}

// Remove from wishlist
async function removeWishlist(req, res, next) {
    try {
        const wishlist = await Wishlist.findOneAndDelete({
            user: req.user.id,
            book: req.params.bookId,
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist item not found",
            });
        }

        res.status(200).json({
            message: "Removed from wishlist",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getWishlist,
    addToWishlist,
    removeWishlist,
};