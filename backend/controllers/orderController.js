const Cart = require("../models/Cart");
const Book = require("../models/Book");
const Order = require("../models/Order");

// order create
async function createOrder(req, res, next) {

    try {
        const cartItems = await Cart.find({
            user: req.user.id,
        }).populate("book");

        if (!cartItems.length) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cartItems) {
            orderItems.push({
                book: item.book._id,
                quantity: item.quantity,
                price: item.book.price,
                bookType: item.book.bookType,
            });

            totalAmount += item.quantity * item.book.price;

            if (
                item.book.bookType === "physical" &&
                item.book.stock < item.quantity
                
            ) {
                return res.status(400).json({
                    message: `${item.book.title} is out of stock`,
                });
            }
        }

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress: req.body.shippingAddress,
        });

        await order.save();

        await Cart.deleteMany({
            user: req.user.id,
        });

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        next(error);
    }
}


// get order
async function getMyOrders(req, res, next) {
    try {
        const orders = await Order.find({
            user: req.user.id,
        }).populate("items.book");

        res.json(orders);
    } catch (error) {
        next(error);
    }
}

// admin get all orders
async function getOrders(req, res, next) {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.book");

        res.json(orders);
    } catch (error) {
        next(error);
    }
}

// update order status
async function updateOrderStatus(req, res, next) {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus: req.body.orderStatus,
            },
            {
                new: true,
            }
        );

        res.json(order);
    } catch (error) {
        next(error);
    }
}

// download digital books
async function downloadBook(req, res, next) {
    try {
        const order = await Order.findOne({
            user: req.user.id,
            paymentStatus: "paid",
            "items.book": req.params.bookId,
        }).populate("items.book");

        if (!order) {
            return res.status(403).json({
                message: "Book not purchased",
            });
        }

        const item = order.items.find(
            item =>
                item.book._id.toString() === req.params.bookId
        );

        if (item.book.bookType !== "digital") {
            return res.status(400).json({
                message: "Not a digital book",
            });
        }

        res.download(
            `public/uploads/pdfs/${item.book.pdfFile}`
        );
    } catch (error) {
        next(error);
    }
}

// update payment status
async function updatePaymentStatus(req, res, next) {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                paymentStatus: req.body.paymentStatus,
            },
            { new: true }
        );

        res.json(order);
    } catch (error) {
        next(error);
    }
}


// user digital library
async function getLibrary(req, res, next) {
    try {
        const orders = await Order.find({
            user: req.user.id,
            paymentStatus: "paid",
        }).populate("items.book");

        const books = [];

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.book.bookType === "digital") {
                    books.push(item.book);
                }
            });
        });

        res.json(books);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    downloadBook,
    updatePaymentStatus,
    getLibrary
}