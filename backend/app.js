// Render's outbound network doesn't route IPv6, but Node's DNS resolver
// can still hand back an AAAA (IPv6) address first for dual-stack hosts
// (Gmail's SMTP servers, Cloudinary's CDN, etc.), which then fails with
// ENETUNREACH. Forcing IPv4-first resolution for the whole process fixes
// outbound requests everywhere (nodemailer, fetch() for Cloudinary PDFs,
// any future outbound call) without touching each call site individually.
require("dns").setDefaultResultOrder("ipv4first");

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./server");
const usersRouter = require("./routers/usersRouter");
const booksRouter = require("./routers/booksRouter");
const cartRouter = require("./routers/cartRouter");
const orderRouter = require("./routers/orderRouter");
const paymentRouter = require("./routers/paymentRouter");
const adminRouter = require("./routers/adminRouter");
const reviewRouter = require("./routers/reviewRouter");
const wishlistRouter = require("./routers/wishlistRouter");
const couponRouter = require("./routers/couponRouter");
const homeRouter = require("./routers/homeRouter");
const notificationRouter = require("./routers/notificationRouter");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

const app = express();

// Behind Render's proxy: trust X-Forwarded-For so req.ip is the real client
// (EPS requires the shopper's IP address).
app.set("trust proxy", 1);

// database connection
connectDB();

// request parsers
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/api/v1/home", homeRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/notifications", notificationRouter);

// invoice route
app.use(
  "/invoices",
  express.static(path.join(__dirname, "public", "uploads", "invoices")),
);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

// make the active payment mode obvious in the logs
const epsMode = require("./utils/eps").isLive() ? "LIVE" : "SANDBOX";
console.log(`EPS payment gateway mode: ${epsMode}`);
if (process.env.NODE_ENV === "production" && epsMode === "SANDBOX") {
  console.error("WARNING: production is running against the EPS SANDBOX.");
}

app.listen(process.env.PORT, () => {
  console.log(`app is connected at port ${process.env.PORT}`);
});
