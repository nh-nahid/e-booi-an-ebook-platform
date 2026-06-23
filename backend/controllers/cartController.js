const Cart = require("../models/Cart");
const Book = require("../models/Book");

// add to cart
async function addToCart(req, res, next) {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const existingItem = await Cart.findOne({
      user: req.user.id,
      book: bookId,
    });

    if (existingItem) {
      return res.status(400).json({
        message: "Book already in cart",
      });
    }

    const cartItem = new Cart({
      user: req.user.id,
      book: bookId,
    });

    await cartItem.save();

    res.status(201).json({
      message: "Book added to cart",
    });
  } catch (error) {
    next(error);
  }
}

// get cart
async function getCart(req, res, next) {
  try {
    const cart = await Cart.find({
      user: req.user.id,
    }).populate("book");

    res.json(cart);
  } catch (error) {
    next(error);
  }
}

// remove from cart
async function removeFromCart(req, res, next) {
  try {
    await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    next(error);
  }
}

// clear cart
async function clearCart(req, res, next) {
  try {
    await Cart.deleteMany({
      user: req.user.id,
    });

    res.json({
      message: "Cart cleared",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
