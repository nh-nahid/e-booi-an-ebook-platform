const express = require("express");

const {
  getDashboard,
  getMonthlySales,
  getTopBooks,
} = require("../controllers/adminController");

const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get("/dashboard", checkLogin, requireRole("admin"), getDashboard);
router.get("/sales", checkLogin, requireRole("admin"), getMonthlySales);
router.get("/top-books", checkLogin, requireRole("admin"), getTopBooks);

module.exports = router;
