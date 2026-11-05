const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrders,
    getOrderById,
    updateOrderStatus,
    downloadBook,
    updatePaymentStatus,
    getLibrary,
    setLibraryHidden,
    downloadInvoice,
} = require("../controllers/orderController");

const {
    checkLogin,
    requireRole,
    forbidAdmin,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

// =======================
// CUSTOMER ROUTES
// =======================

// Create Order
router.post(
    "/",
    checkLogin,
    forbidAdmin,
    createOrder
);

// My Orders
router.get(
    "/my-orders",
    checkLogin,
    forbidAdmin,
    getMyOrders
);

// My Digital Library
router.get(
    "/library",
    checkLogin,
    forbidAdmin,
    getLibrary
);

// Remove from / restore to my library view
router.patch("/library/:bookId/hide", checkLogin, forbidAdmin, (req, res, next) => {
    req.params.action = "hide";
    setLibraryHidden(req, res, next);
});
router.patch("/library/:bookId/unhide", checkLogin, forbidAdmin, (req, res, next) => {
    req.params.action = "unhide";
    setLibraryHidden(req, res, next);
});

// Download purchased Digital book
router.get(
    "/download/:bookId",
    checkLogin,
    forbidAdmin,
    downloadBook
);

// Download invoice
router.get(
    "/:id/invoice",
    checkLogin,
    downloadInvoice
);

// Get single order (owner or admin)
router.get(
    "/:id",
    checkLogin,
    getOrderById
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