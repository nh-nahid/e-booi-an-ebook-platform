const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { unlink } = require("fs");
const path = require("path");

// =======================
// GET ALL USERS (ADMIN)
// =======================
async function getUsers(req, res, next) {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

// =======================
// GET SINGLE USER
// =======================
async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

// =======================
// ADD USER (REGISTER)
// =======================
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
            message: "User registered successfully!",
        });
    } catch (error) {
        next(error);
    }
}

// =======================
// UPDATE USER
// =======================
async function updateUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // update avatar (if new file uploaded)
        if (req.files && req.files.length > 0) {
            const newFile = req.files[0].filename;

            // delete old avatar
            if (user.avatar) {
                const oldPath = path.join(
                    __dirname,
                    "..",
                    "public/uploads/avatars",
                    user.avatar
                );

                unlink(oldPath, (err) => {
                    if (err) console.log("Old avatar delete error:", err);
                });
            }

            req.body.avatar = newFile;
        }

        // hash password if updated
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json({
            message: "User updated successfully",
        });
    } catch (error) {
        next(error);
    }
}

// =======================
// DELETE USER
// =======================
async function deleteUser(req, res, next) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // delete avatar
        if (user.avatar) {
            const filePath = path.join(
                __dirname,
                "..",
                "public/uploads/avatars",
                user.avatar
            );

            unlink(filePath, (err) => {
                if (err) console.log("Avatar delete error:", err);
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

// =======================
// LOGIN USER
// =======================
async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

// =======================
// LOGOUT USER
// =======================
async function logoutUser(req, res) {
    res.clearCookie("token");

    res.status(200).json({
        message: "Logout successful",
    });
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
};