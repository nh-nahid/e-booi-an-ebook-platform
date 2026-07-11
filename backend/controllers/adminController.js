const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const User = require("../models/User");
const Book = require("../models/Book");
const Order = require("../models/Order");

const sendEmail = require("../utils/sendEmail");
const welcomeEmail = require("../emails/templates/welcomeEmail");

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

// get all users
async function getUsers(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "all",
    } = req.query;

    const query = {};

    // Search by name or email
    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by role
    if (role !== "all") {
      query.role = role;
    }

    const currentPage = Number(page);
    const perPage = Number(limit);

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    next(error);
  }
}

// get single user
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// create user
async function createUser(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      phone,
      bio,
      role = "user",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = req.files?.[0]?.filename || null;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bio,
      role,
      avatar,
    });

    await sendEmail({
      to: user.email,
      subject: "Welcome to E-Booi",
      html: welcomeEmail(user),
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// update user
async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.files?.length) {
      if (user.avatar) {
        const oldAvatar = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          "avatars",
          user.avatar
        );

        if (fs.existsSync(oldAvatar)) {
          fs.unlinkSync(oldAvatar);
        }
      }

      req.body.avatar = req.files[0].filename;
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

// delete user
async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.avatar) {
      const avatarPath = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "avatars",
        user.avatar
      );

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
  getMonthlySales,
  getTopBooks,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
