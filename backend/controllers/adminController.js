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
            (sum, order) => sum + order.totalAmount,
            0
        );

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
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
                        $sum: "$totalAmount",
                    },
                    totalOrders: {
                        $sum: 1,
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

// best selling books
async function getTopBooks(req, res, next) {
    try {
        const books = await Order.aggregate([
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
        ]);

        res.json(books);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getDashboard,
    getMonthlySales,
    getTopBooks
};