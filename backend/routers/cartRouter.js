const express = require("express");

const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    updateCartQuantity,
} = require("../controllers/cartController");

const { checkLogin, forbidAdmin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.use(checkLogin, forbidAdmin);

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:id", updateCartQuantity);

router.delete("/:id", removeFromCart);

router.delete("/", clearCart);

module.exports = router;