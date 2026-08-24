const SSLCommerzPayment = require("sslcommerz-lts");

const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");

const sendEmail = require("../utils/sendEmail");

const paymentEmail = require("../emails/templates/paymentEmail");
const DigitalBookEmail = require("../emails/templates/digitalBookEmail");
const generateInvoice = require("../utils/generateInvoice");

// ======================
// INITIALIZE PAYMENT
// ======================
async function initiatePayment(req, res, next) {
    try {
        const order = await Order.findById(req.params.id)
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

        // eBooi is Digital-only now — there's never a physical shipment,
        // so shipping fields just mirror the customer's account details
        // (SSLCommerz still requires them to be non-empty).
        const data = {
            total_amount: order.finalAmount || order.totalAmount,
            currency: "BDT",
            tran_id: order._id.toString(),

            success_url: `${process.env.BACKEND_URL}/api/v1/payment/success`,
            fail_url: `${process.env.BACKEND_URL}/api/v1/payment/fail`,
            cancel_url: `${process.env.BACKEND_URL}/api/v1/payment/cancel`,
            ipn_url: `${process.env.BACKEND_URL}/api/v1/payment/ipn`,

            shipping_method: "NO",

            product_name: "Book Purchase",
            product_category: "Books",
            product_profile: "general",

            // Shipping Information (unused for Digital delivery, but
            // SSLCommerz requires these fields to be populated)
            ship_name: customer?.name || "Customer",
            ship_add1: "N/A",
            ship_city: "N/A",
            ship_postcode: "0000",
            ship_country: "Bangladesh",
            ship_phone: customer?.phone || "01700000000",

            // Customer Information
            cus_name: customer?.name || "Customer",
            cus_email: customer?.email || "customer@example.com",
            cus_phone: customer?.phone || "01700000000",
            cus_add1: "N/A",
            cus_city: "N/A",
            cus_country: "Bangladesh",
        };

        const sslcz = new SSLCommerzPayment(
            process.env.SSL_STORE_ID,
            process.env.SSL_STORE_PASSWORD,
            process.env.SSL_IS_LIVE === "true"
        );

        const apiResponse = await sslcz.init(data);

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

// ======================
// PAYMENT SUCCESS
// ======================
async function paymentSuccess(req, res, next) {
    try {
        const { tran_id, bank_tran_id } = req.body;

        const order = await Order.findById(tran_id)
            .populate("items.book")
            .populate("coupon");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Prevent duplicate callback processing
        if (order.paymentStatus === "paid") {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`
            );
        }

        // Update payment info
        order.paymentStatus = "paid";
        order.transactionId = bank_tran_id;
        order.paidAt = new Date();

        // Increase coupon usage
        if (order.coupon) {
            await Coupon.findByIdAndUpdate(order.coupon._id, {
                $inc: {
                    usedCount: 1,
                },
            });
        }

        // Clear cart now that payment is confirmed — deferred from
        // createOrder for the same reason as stock above. Skipped for a
        // "buy now" order (fromCart: false): its items never came from
        // the cart, so clearing here would wipe unrelated items the
        // customer still has sitting in their real cart.
        if (order.fromCart !== false) {
            await Cart.deleteMany({ user: order.user });
        }

        // Customer
        const user = await User.findById(order.user);

        // Generate invoice
        const invoice = await generateInvoice(order, user);

        order.invoiceNumber = invoice.invoiceNumber;
        order.invoiceUrl = invoice.invoiceUrl;

        await order.save();

        // Payment confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: "Payment Successful",
                html: paymentEmail(user, order, bank_tran_id),
            });
        } catch (emailError) {
            console.log("Payment email failed:", emailError.message);
        }

        // Send Digital books email — eBooi is Digital-only, so every
        // purchased item qualifies.
        const DigitalBooks = order.items
            .filter((item) => item.book)
            .map((item) => item.book);

        if (DigitalBooks.length > 0) {
            try {
                await sendEmail({
                    to: user.email,
                    subject: "Your Digital Books",
                    html: DigitalBookEmail(user, DigitalBooks),
                });
            } catch (emailError) {
                console.log("Digital email failed:", emailError.message);
            }
        }

        res.redirect(
            `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`
        );
    } catch (error) {
        next(error);
    }
}

// ======================
// PAYMENT FAILED
// ======================
async function paymentFail(req, res) {
    const { tran_id } = req.body;
    res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed?orderId=${tran_id ?? ""}`
    );
}

// ======================
// PAYMENT CANCELLED
// ======================
async function paymentCancel(req, res) {
    const { tran_id } = req.body;
    res.redirect(
        `${process.env.FRONTEND_URL}/payment-cancel?orderId=${tran_id ?? ""}`
    );
}

module.exports = {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
};