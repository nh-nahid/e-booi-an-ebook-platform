const express = require("express");

const {
  getDashboard,
  getMonthlySales,
  getTopBooks,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} = require("../controllers/adminController");

const { broadcast } = require("../controllers/notificationController");
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const { avatarUpload } = require("../middlewares/users/avatarUpload");

const router = express.Router();

router.use(checkLogin, requireRole("admin"));

router.post("/notifications", broadcast);
router.get("/dashboard", getDashboard);
router.get("/sales", getMonthlySales);
router.get("/top-books", getTopBooks);

// User Management
router.get("/users", getUsers);
router.get("/users/:id", getUser);

router.post(
  "/users",
  checkLogin,
  requireRole("admin"),
  avatarUpload,
  createUser,
);

router.put("/users/:id", avatarUpload, updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;
