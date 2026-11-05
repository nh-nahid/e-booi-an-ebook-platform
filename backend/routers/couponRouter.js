const express = require("express");

const {
    createCoupon,
    updateCoupon,
    getCoupons,
    deleteCoupon,
    applyCoupon,
} = require("../controllers/couponController");

const {
    checkLogin,
    requireRole,
    forbidAdmin,
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

router.put(
    "/:id",
    checkLogin,
    requireRole("admin"),
    updateCoupon
);

router.delete(
    "/:id",
    checkLogin,
    requireRole("admin"),
    deleteCoupon
);

router.post("/apply", checkLogin, forbidAdmin, applyCoupon);

module.exports = router;