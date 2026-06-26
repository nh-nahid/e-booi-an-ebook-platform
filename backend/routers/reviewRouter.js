const express = require("express");

const {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get("/book/:bookId", getReviews);

router.post("/book/:bookId", checkLogin, addReview);

router.put("/:id", checkLogin, updateReview);

router.delete("/:id", checkLogin, deleteReview);

module.exports = router;
