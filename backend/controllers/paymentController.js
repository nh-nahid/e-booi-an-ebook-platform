const { notifyUser } = require("../utils/notify");
const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");

const sendEmail = require("../utils/sendEmail");

const paymentEmail = require("../emails/templates/paymentEmail");
const DigitalBookEmail = require("../emails/templates/digitalBookEmail");
const generateInvoice = require("../utils/generateInvoice");
const eps = require("../utils/eps");

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

        // EPS is the only supported payment gateway.
        if (order.paymentMethod !== "eps") {
            return res.status(400).json({
                message:
                    "This order's payment method is no longer supported. Please place a new order.",
            });
        }

        return await initiateEpsPayment(order, req, res);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// ======================
// MARK ORDER PAID (called once a gateway confirms payment)
// ======================
async function markOrderPaid(order, transactionId) {
        // Update payment info
        order.paymentStatus = "paid";
        order.transactionId = transactionId;
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

        await notifyUser(order.user, {
            type: "payment",
            title: "পেমেন্ট সফল হয়েছে",
            message: `৳${order.totalAmount} পেমেন্ট নিশ্চিত হয়েছে। বইগুলো এখন আপনার লাইব্রেরিতে।`,
            link: `/orders/${order._id}`,
        });

        // Payment confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: "Payment Successful",
                html: paymentEmail(user, order, transactionId),
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

}

// ======================
// EPS (Easy Payment System)
// ======================

// Where to send the shopper after EPS: the website, or the app's deep link
// when the order was started from the mobile app.
function returnUrl(order, path) {
    if (order && order.source === "mobile") {
        return `ebooi://${path}`;
    }
    return `${process.env.FRONTEND_URL}/${path}`;
}
function clientIp(req) {
    const ip = (req.ip || "").replace("::ffff:", "");
    return ip && !ip.includes(":") ? ip : "127.0.0.1";
}

async function initiateEpsPayment(order, req, res) {
    const customer = order.user;
    const amount = Number(order.finalAmount ?? order.totalAmount);
    if (req.body && req.body.source === "mobile") {
        order.source = "mobile";
    }

    if (!Number.isFinite(amount) || amount < 0) {
        console.log("EPS: invalid order amount", {
            orderId: String(order._id),
            finalAmount: order.finalAmount,
            totalAmount: order.totalAmount,
        });
        return res.status(400).json({
            message: "Invalid order amount. Please place the order again.",
        });
    }

    // Nothing to charge (free book or a 100% coupon): EPS rejects amounts
    // below 1 BDT, so complete the order directly without the gateway.
    if (amount === 0) {
        await order.populate("items.book");
        await markOrderPaid(order, `FREE-${order._id}`);
        return res.json({
            gatewayURL: returnUrl(order, `payment-success?orderId=${order._id}`),
        });
    }

    if (amount < 1) {
        return res.status(400).json({
            message: "The minimum online payment amount is ৳1.",
        });
    }

    // A fresh id for every attempt — EPS rejects duplicates.
    const merchantTransactionId = eps.generateMerchantTransactionId();
    order.epsMerchantTransactionId = merchantTransactionId;
    await order.save();

    const callbackBase = `${process.env.BACKEND_URL}/api/v1/payment/eps`;

    const payload = {
        storeId: process.env.EPS_STORE_ID,
        ...(process.env.EPS_MERCHANT_ID
            ? { merchantId: process.env.EPS_MERCHANT_ID }
            : {}),
        CustomerOrderId: order._id.toString(),
        merchantTransactionId,
        transactionTypeId: Number(process.env.EPS_TRANSACTION_TYPE_ID || 1),
        financialEntityId: 0,
        transitionStatusId: 0,
        totalAmount: amount,
        ipAddress: clientIp(req),
        version: "1",
        successUrl: `${callbackBase}/success`,
        failUrl: `${callbackBase}/fail`,
        cancelUrl: `${callbackBase}/cancel`,

        // eBooi is Digital-only; EPS still requires address fields.
        customerName: customer?.name || "Customer",
        customerEmail: customer?.email || "customer@example.com",
        customerAddress: "N/A",
        customerCity: "Dhaka",
        customerState: "Dhaka",
        customerPostcode: "1000",
        customerCountry: "BD",
        customerPhone: customer?.phone || "01700000000",

        shippingMethod: "NO",
        noOfItem: String(order.items?.length || 1),
        productName: "Book Purchase",
        productProfile: "general",
        productCategory: "Books",
    };

    let redirectUrl;
    try {
        ({ redirectUrl } = await eps.initializePayment(payload));
    } catch (error) {
        console.log("EPS initialize failed:", error.message, { amount });
        return res.status(502).json({
            message:
                "Could not start the payment. Please try again in a moment.",
        });
    }

    return res.json({ gatewayURL: redirectUrl });
}

// EPS returns the shopper to successUrl/failUrl/cancelUrl with data in the
// query string. The query string is user-controlled, so it is only used to
// *identify* the order — success is always confirmed server-to-server.
async function loadEpsOrder(req) {
    const params = { ...(req.query || {}), ...(req.body || {}) };
    const raw = eps.pick(params, "merchantTransactionId");
    const txnId = raw ? String(raw) : null;

    const order = txnId
        ? await Order.findOne({ epsMerchantTransactionId: txnId })
              .populate("items.book")
              .populate("coupon")
        : null;

    return { params, txnId, order };
}

async function epsSuccess(req, res, next) {
    try {
        const { params, txnId, order } = await loadEpsOrder(req);

        if (!order) {
            console.log("EPS success callback: order not found", params);
            return res.redirect(returnUrl(null, "payment-failed?orderId="));
        }

        if (order.paymentStatus === "paid") {
            return res.redirect(
                returnUrl(order, `payment-success?orderId=${order._id}`)
            );
        }

        const result = await eps.checkTransactionStatus(txnId);
        const status = String(eps.pick(result, "Status") || "");
        const paidAmount = Number(eps.pick(result, "TotalAmount"));
        const expected = Number(order.finalAmount ?? order.totalAmount);

        const verified =
            status.toLowerCase() === "success" &&
            Math.abs(paidAmount - expected) < 0.01;

        if (!verified) {
            console.log("EPS verification failed", { txnId, status, paidAmount, expected });
            return res.redirect(
                returnUrl(order, `payment-failed?orderId=${order._id}`)
            );
        }

        await markOrderPaid(order, txnId);

        return res.redirect(
            returnUrl(order, `payment-success?orderId=${order._id}`)
        );
    } catch (error) {
        next(error);
    }
}

async function epsFail(req, res, next) {
    try {
        const { order } = await loadEpsOrder(req);
        res.redirect(
            returnUrl(order, `payment-failed?orderId=${order?._id ?? ""}`)
        );
    } catch (error) {
        next(error);
    }
}

async function epsCancel(req, res, next) {
    try {
        const { order } = await loadEpsOrder(req);
        res.redirect(
            returnUrl(order, `payment-cancel?orderId=${order?._id ?? ""}`)
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    epsSuccess,
    epsFail,
    epsCancel,
    initiatePayment,
};