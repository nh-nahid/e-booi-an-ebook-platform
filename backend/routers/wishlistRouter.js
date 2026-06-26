const express = require("express");

const {
    getWishlist,
    addToWishlist,
    removeWishlist,
} = require("../controllers/wishlistController");

const {
    checkLogin,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get(
    "/",
    checkLogin,
    getWishlist
);

router.post(
    "/",
    checkLogin,
    addToWishlist
);

router.delete(
    "/:bookId",
    checkLogin,
    removeWishlist
);

module.exports = router;