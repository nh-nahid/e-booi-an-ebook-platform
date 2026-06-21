const mongoose = require('mongoose');

const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
       console.log('database connection successfull!');
       console.log("Database:", conn.connection.name);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB