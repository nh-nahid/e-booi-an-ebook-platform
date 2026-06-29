const SSLCommerzPayment = require("sslcommerz-lts");

const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");

const sendEmail = require("../utils/sendEmail");

const paymentEmail = require("../emails/templates/paymentEmail");
const digitalBookEmail = require("../emails/templates/digitalBookEmail");

// ======================
// INITIALIZE PAYMENT
// ======================
async function initiatePayment(req, res, next) {
    try {
        const order = await Order.findById(
            req.params.id
        )
            .populate("user")
            .populate("coupon");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Order already paid",
            });
        }

        const customer = order.user;

        const data = {
            total_amount:
                order.finalAmount || order.totalAmount,

            currency: "BDT",

            tran_id: order._id.toString(),

            success_url:
                `${process.env.BACKEND_URL}/api/v1/payment/success`,

            fail_url:
                `${process.env.BACKEND_URL}/api/v1/payment/fail`,

            cancel_url:
                `${process.env.BACKEND_URL}/api/v1/payment/cancel`,

            ipn_url:
                `${process.env.BACKEND_URL}/api/v1/payment/ipn`,

            shipping_method: "Courier",

            product_name: "Book Purchase",

            product_category: "Books",

            product_profile: "general",

            // Shipping Information
            ship_name:
                order.shippingAddress.fullName,

            ship_add1:
                order.shippingAddress.address,

            ship_city:
                order.shippingAddress.city,

            ship_postcode:
                order.shippingAddress.postalCode ||
                "0000",

            ship_country: "Bangladesh",

            ship_phone:
                order.shippingAddress.phone,

            // Customer Information
            cus_name:
                order.shippingAddress.fullName,

            cus_email:
                customer?.email ||
                "customer@example.com",

            cus_phone:
                order.shippingAddress.phone,

            cus_add1:
                order.shippingAddress.address,

            cus_city:
                order.shippingAddress.city,

            cus_country: "Bangladesh",
        };

        const sslcz = new SSLCommerzPayment(
            process.env.SSL_STORE_ID,
            process.env.SSL_STORE_PASSWORD,
            process.env.SSL_IS_LIVE === "true"
        );

        const apiResponse = await sslcz.init(data);

        if (
            !apiResponse ||
            !apiResponse.GatewayPageURL
        ) {
            return res.status(500).json({
                message:
                    "Payment gateway failed to initialize",
                debug: apiResponse,
            });
        }

        return res.json({
            gatewayURL:
                apiResponse.GatewayPageURL,
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// ======================
// PAYMENT SUCCESS
// ======================
async function paymentSuccess(req, res, next) {
    try {
        const { tran_id, bank_tran_id } = req.body;

        const order = await Order.findById(
            tran_id
        )
            .populate("items.book")
            .populate("coupon");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Prevent duplicate processing
        if (order.paymentStatus === "paid") {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment-success`
            );
        }

        order.paymentStatus = "paid";
        order.transactionId = bank_tran_id;
        order.paidAt = new Date();

        await order.save();

        // Increase coupon usage count
        if (order.coupon) {
            await Coupon.findByIdAndUpdate(
                order.coupon._id,
                {
                    $inc: {
                        usedCount: 1,
                    },
                }
            );
        }

        // Get customer
        const user = await User.findById(
            order.user
        );

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

        // Digital books
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
                    "Digital email failed:",
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

// ======================
// PAYMENT FAILED
// ======================
async function paymentFail(req, res) {
    res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
    );
}

// ======================
// PAYMENT CANCELLED
// ======================
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
};