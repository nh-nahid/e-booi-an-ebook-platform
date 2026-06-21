const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

// database connection
const connectDB = async () => {
    try {
       const conn = mongoose.connect(process.env.MONGO_CONNECTION_STRING);
       console.log('database connection successfull!');
    } catch (error) {
        console.log(error);
    }
}

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`app is connected at port ${process.env.PORT}`)
})
