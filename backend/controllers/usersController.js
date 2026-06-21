const bcrypt = require('bcrypt');
const User = require('../models/User');
const { unlink } = require('fs');
const path = require('path');

// add user
async function addUser(req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const file = req.files && req.files.length > 0 ? req.files[0] : null;
        const filename = file ? file.filename : null;

        const newUser = new User({
            ...req.body,
            avatar: filename,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "User was added successfully!"
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occured!"
                }
            }
        })
    }
}


module.exports = {
    addUser,
}