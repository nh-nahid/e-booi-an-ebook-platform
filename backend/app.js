const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const path = require('path');
const connectDB = require('./server');
const usersRouter = require('./routers/usersRouter');
const booksRouter = require("./routers/booksRouter");
const cartRouter = require("./routers/cartRouter");
const orderRouter = require("./routers/orderRouter");
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');


const app = express();
dotenv.config();

// database connection
connectDB();

// request parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use('/api/v1/users', usersRouter);
app.use("/api/v1/books", booksRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log(`app is connected at port ${process.env.PORT}`)
})
