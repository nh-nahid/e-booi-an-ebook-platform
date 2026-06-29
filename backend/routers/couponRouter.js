const express = require("express");

const {
    createCoupon,
    getCoupons,
    deleteCoupon,
    applyCoupon,
} = require("../controllers/couponController");

const {
    checkLogin,
    requireRole,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.post(
    "/",
    checkLogin,
    requireRole("admin"),
    createCoupon
);

router.get(
    "/",
    checkLogin,
    requireRole("admin"),
    getCoupons
);

router.delete(
    "/:id",
    checkLogin,
    requireRole("admin"),
    deleteCoupon
);

router.post("/apply", checkLogin, applyCoupon);

module.exports = router;