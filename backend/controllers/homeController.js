const Book = require("../models/Book");

// get home
async function getHome(req, res, next) {
  try {
    const featuredBooks = await Book.find()
      .select(
        "_id title author category coverImage price bookType averageRating reviewCount sold isFeatured isPreOrder",
      )
      .limit(8);

    const latestBooks = await Book.find().sort({ createdAt: -1 }).limit(8);

    const preOrderBooks = await Book.find({
      isPreOrder: true,
    }).limit(8);

    const bestSellingBooks = await Book.find().sort({ sold: -1 }).limit(8);

    const categories = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          booksCount: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          booksCount: 1,
        },
      },
    ]);

    const totalBooks = await Book.countDocuments();

    const totalAuthors = await Book.distinct("author");

    const totalCategories = categories.length;

    return res.status(200).json({
      success: true,
      message: "Homepage data fetched successfully",
      data: {
        hero: {
          title: "Discover Your Next Favorite Book",
          subtitle: "Thousands of eBooks and physical books",
          description: "Read anytime, anywhere.",
          image: "hero-banner.jpg",
          button: {
            text: "Browse Books",
            link: "/books",
          },
        },

        statistics: {
          totalBooks,
          totalAuthors: totalAuthors.length,
          totalCategories,
          happyCustomers: 3560,
        },

        categories,

        featuredBooks,

        latestBooks,

        bestSellingBooks,

        preOrderBooks,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHome,
};
