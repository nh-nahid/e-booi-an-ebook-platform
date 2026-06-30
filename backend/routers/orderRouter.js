const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    downloadBook,
    updatePaymentStatus,
    getLibrary,
    downloadInvoice,
} = require("../controllers/orderController");

const {
    checkLogin,
    requireRole,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

// =======================
// CUSTOMER ROUTES
// =======================

// Create Order
router.post(
    "/",
    checkLogin,
    createOrder
);

// My Orders
router.get(
    "/my-orders",
    checkLogin,
    getMyOrders
);

// My Digital Library
router.get(
    "/library",
    checkLogin,
    getLibrary
);

// Download purchased digital book
router.get(
    "/download/:bookId",
    checkLogin,
    downloadBook
);

// Download invoice
router.get(
    "/:id/invoice",
    checkLogin,
    downloadInvoice
);

// =======================
// ADMIN ROUTES
// =======================

// All Orders
router.get(
    "/",
    checkLogin,
    requireRole("admin"),
    getOrders
);

// Update order status
router.patch(
    "/:id/status",
    checkLogin,
    requireRole("admin"),
    updateOrderStatus
);

// Update payment status (COD etc.)
router.patch(
    "/:id/payment",
    checkLogin,
    requireRole("admin"),
    updatePaymentStatus
);

module.exports = router;