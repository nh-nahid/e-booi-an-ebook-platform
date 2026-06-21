const bcrypt = require('bcrypt');
const User = require('../models/User');

// add user
async function addUser(req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "User was added successfully!"
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    addUser,
}