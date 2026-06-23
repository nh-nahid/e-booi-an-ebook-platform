const express = require("express");

const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
} = require("../controllers/cartController");

const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.use(checkLogin);

router.get("/", getCart);

router.post("/", addToCart);

router.delete("/:id", removeFromCart);

router.delete("/", clearCart);

module.exports = router;