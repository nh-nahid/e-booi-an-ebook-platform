const User = require("../models/User");
const Book = require("../models/Book");
const Order = require("../models/Order");

// dashboard details
async function getDashboard(req, res, next) {
  try {
    const totalUsers = await User.countDocuments();

    const totalBooks = await Book.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    const paidOrders = await Order.find({
      paymentStatus: "paid",
    });

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.finalAmount,
      0,
    );

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // category analytics
    const categoryAnalytics = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },
    ]);

    // latest users
    const latestUsers = await User.find()
      .select("name email avatar createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      statistics: {
        totalUsers,
        totalBooks,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },

      recentOrders,

      categoryAnalytics,

      latestUsers,
    });
  } catch (error) {
    next(error);
  }
}

// monthly sales analytics
async function getMonthlySales(req, res, next) {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },

          totalSales: {
            $sum: "$finalAmount",
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(sales);
  } catch (error) {
    next(error);
  }
}

// top selling books
async function getTopBooks(req, res, next) {
  try {
    const books = await Order.aggregate([
      // Count only paid orders (recommended)
      {
        $match: {
          paymentStatus: "paid",
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.book",
          sold: {
            $sum: "$items.quantity",
          },
        },
      },

      {
        $sort: {
          sold: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },

      // Remove entries whose book no longer exists
      {
        $unwind: {
          path: "$book",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: "$book._id",
          sold: 1,
          title: "$book.title",
          author: "$book.author",
          coverImage: "$book.coverImage",
          price: "$book.price",
        },
      },
    ]);

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getMonthlySales,
  getTopBooks,
};
