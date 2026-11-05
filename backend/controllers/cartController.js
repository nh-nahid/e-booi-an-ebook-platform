const Cart = require("../models/Cart");
const Book = require("../models/Book");

// add to cart
async function addToCart(req, res, next) {
  try {
    const { bookId, quantity = 1 } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    let cartItem = await Cart.findOne({
      user: req.user.id,
      book: bookId,
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);

      await cartItem.save();

      return res.status(200).json({
        message: "Cart updated successfully",
        data: cartItem,
      });
    }

    cartItem = await Cart.create({
      user: req.user.id,
      book: bookId,
      quantity: Number(quantity),
    });

    res.status(201).json({
      message: "Book added to cart",
      data: cartItem,
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
    }).populate({
      path: "book",
      select:
        "title author coverImage price bookType isPreOrder",
    });

    // A book can be deleted while still sitting in someone's cart; populate
    // then yields book: null, which crashed the cart page. Drop (and clean
    // up) such orphaned entries.
    const valid = cart.filter((item) => item.book);
    if (valid.length !== cart.length) {
      const orphanIds = cart.filter((item) => !item.book).map((i) => i._id);
      await Cart.deleteMany({ _id: { $in: orphanIds } });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: valid,
    });
  } catch (error) {
    next(error);
  }
}
// update cart
async function updateCartQuantity(req,res,next){
  try {

    const cartItem = await Cart.findOne({
      _id:req.params.id,
      user:req.user.id
    }).populate("book");


    if(!cartItem){
      return res.status(404).json({
        message:"Cart item not found"
      });
    }


    // ebooi is Digital-only — one copy per cart line item.
    cartItem.quantity = 1;


    await cartItem.save();


    res.json({
      message:"Cart updated",
      data:cartItem
    });


  } catch(error){
    next(error);
  }
}

// remove from cart
async function removeFromCart(req, res, next) {
  try {
    const item = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

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
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
