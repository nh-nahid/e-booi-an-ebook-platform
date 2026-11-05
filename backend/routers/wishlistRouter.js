const express = require("express");

const {
    getWishlist,
    addToWishlist,
    removeWishlist,
} = require("../controllers/wishlistController");

const {
    checkLogin,
    forbidAdmin,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.get(
    "/",
    checkLogin,
    forbidAdmin,
    getWishlist
);

router.post(
    "/",
    checkLogin,
    forbidAdmin,
    addToWishlist
);

router.delete(
    "/:bookId",
    checkLogin,
    forbidAdmin,
    removeWishlist
);

module.exports = router;