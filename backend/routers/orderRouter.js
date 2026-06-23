const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    downloadBook,
    updatePaymentStatus,
    getLibrary,
} = require("../controllers/orderController");

const {
    checkLogin,
    requireRole,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.post(
    "/",
    checkLogin,
    createOrder
);

router.get(
    "/my-orders",
    checkLogin,
    getMyOrders
);

router.get(
    "/library",
    checkLogin,
    getLibrary
);

router.get(
    "/",
    checkLogin,
    requireRole("admin"),
    getOrders
);

router.patch(
    "/:id/status",
    checkLogin,
    requireRole("admin"),
    updateOrderStatus
);

router.get(
    "/download/:bookId",
    checkLogin,
    downloadBook
);

router.patch(
    "/:id/payment",
    checkLogin,
    requireRole("admin"),
    updatePaymentStatus
);


module.exports = router;