const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const paymentEmail = require("../emails/templates/paymentEmail");
const digitalBookEmail = require("../emails/templates/digitalBookEmail");
const User = require("../models/User");

// initialize payment
async function initiatePayment(req, res, next) {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

       const data = {
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id: order._id.toString(),

    success_url: `${process.env.BACKEND_URL}/api/v1/payment/success`,
    fail_url: `${process.env.BACKEND_URL}/api/v1/payment/fail`,
    cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/cancel`,

    ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/ipn`,

    shipping_method: "Courier",
    product_name: "Book Purchase",
    product_category: "Books",
    product_profile: "general",

    // ✅ REQUIRED SHIPPING FIELDS
    ship_name: order.shippingAddress.fullName,
    ship_add1: order.shippingAddress.address,
    ship_city: order.shippingAddress.city,
    ship_postcode: order.shippingAddress.postalCode || "0000",
    ship_country: "Bangladesh",
    ship_phone: order.shippingAddress.phone,

    // CUSTOMER INFO
    cus_name: order.shippingAddress.fullName,
    cus_email: "test@email.com",
    cus_phone: order.shippingAddress.phone,
    cus_add1: order.shippingAddress.address,
    cus_city: order.shippingAddress.city,
    cus_country: "Bangladesh",
};

        console.log("SSL DATA:", data);

        const sslcz = new SSLCommerzPayment(
            process.env.SSL_STORE_ID,
            process.env.SSL_STORE_PASSWORD,
            process.env.SSL_IS_LIVE === "true"
        );

        const apiResponse = await sslcz.init(data);

        console.log("SSL RESPONSE:", apiResponse);

        if (!apiResponse || !apiResponse.GatewayPageURL) {
            return res.status(500).json({
                message: "Payment gateway failed to initialize",
                debug: apiResponse,
            });
        }

        return res.json({
            gatewayURL: apiResponse.GatewayPageURL,
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// payment success
async function paymentSuccess(req, res, next) {
    try {
        const { tran_id, bank_tran_id } = req.body;

        const order = await Order.findById(tran_id)
            .populate("items.book");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        order.paymentStatus = "paid";
        order.transactionId = bank_tran_id;
        order.paidAt = new Date();

        await order.save();

        // Get customer
        const user = await User.findById(order.user);

        // Payment success email
        try {
            await sendEmail({
                to: user.email,
                subject: "Payment Successful",
                html: paymentEmail(
                    user,
                    order,
                    bank_tran_id
                ),
            });
        } catch (emailError) {
            console.log(
                "Payment email failed:",
                emailError.message
            );
        }

        // Send digital books email
        const digitalBooks = order.items
            .filter(
                item =>
                    item.book &&
                    item.book.bookType === "digital"
            )
            .map(item => item.book);

        if (digitalBooks.length > 0) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: "Your Digital Books",
                    html: digitalBookEmail(
                        user,
                        digitalBooks
                    ),
                });
            } catch (emailError) {
                console.log(
                    "Digital book email failed:",
                    emailError.message
                );
            }
        }

        res.redirect(
            `${process.env.FRONTEND_URL}/payment-success`
        );

    } catch (error) {
        next(error);
    }
}

//payment fail
async function paymentFail(req, res) {
    res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
    );
}

//payment cancel
async function paymentCancel(req, res) {
    res.redirect(
        `${process.env.FRONTEND_URL}/payment-cancel`
    );
}

module.exports = {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
}