const Review = require("../models/Review");
const Book = require("../models/Book");
const Order = require("../models/Order");


// create review
async function addReview(req, res, next) {
    try {
        const { rating, comment } = req.body;

        const bookId = req.params.bookId;

        // Verify purchase
        const order = await Order.findOne({
            user: req.user.id,
            paymentStatus: "paid",
            "items.book": bookId,
        });

        if (!order) {
            return res.status(403).json({
                message:
                    "Purchase required before review",
            });
        }

        const review = new Review({
            user: req.user.id,
            book: bookId,
            rating,
            comment,
        });

        await review.save();

        await updateBookRating(bookId);

        res.status(201).json({
            message: "Review added",
            review,
        });
    } catch (error) {
        next(error);
    }
}

// get book review
async function getReviews(req, res, next) {
    try {
        const reviews = await Review.find({
            book: req.params.bookId,
        })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        next(error);
    }
}

// update review
async function updateReview(req, res, next) {
    try {
        const review = await Review.findById(
            req.params.id
        );

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }

        if (
            review.user.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        review.rating = req.body.rating;
        review.comment = req.body.comment;

        await review.save();

        await updateBookRating(
            review.book
        );

        res.json({
            message: "Review updated",
        });
    } catch (error) {
        next(error);
    }
}

// delete review
async function deleteReview(req, res, next) {
    try {
        const review = await Review.findById(
            req.params.id
        );

        if (!review) {
            return res.status(404).json({
                message: "Review not found",
            });
        }

        if (
            review.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        const bookId = review.book;

        await review.deleteOne();

        await updateBookRating(bookId);

        res.json({
            message: "Review deleted",
        });
    } catch (error) {
        next(error);
    }
}


// rating calculation helper
async function updateBookRating(bookId) {
    const reviews = await Review.find({
        book: bookId,
    });

    const count = reviews.length;

    const average =
        count === 0
            ? 0
            : reviews.reduce(
                  (sum, r) =>
                      sum + r.rating,
                  0
              ) / count;

    await Book.findByIdAndUpdate(
        bookId,
        {
            averageRating:
                average.toFixed(1),
            reviewCount: count,
        }
    );
}



module.exports = {
    addReview,
    getReviews,
    updateReview,
    deleteReview,
};