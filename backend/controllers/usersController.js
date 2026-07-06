const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { unlink } = require("fs");
const path = require("path");
const sendEmail = require('../utils/sendEmail');
const welcomeEmail = require('../emails/templates/welcomeEmail');
const resetPasswordEmail = require("../emails/templates/resetPasswordEmail");
const fs = require("fs");

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

// GET PROFILE
async function getProfile(req, res, next) {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
}

// UPDATE PROFILE
async function updateProfile(req, res, next) {
    try {
        const { name, phone, address } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        next(error);
    }
}

// UPDATE AVATAR
async function updateAvatar(req, res, next) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Avatar is required",
            });
        }

        if (user.avatar) {
            const oldAvatar = path.join(
                __dirname,
                "..",
                "public",
                "uploads",
                "avatars",
                user.avatar
            );

            if (fs.existsSync(oldAvatar)) {
                fs.unlinkSync(oldAvatar);
            }
        }

        user.avatar = req.files[0].filename;

        await user.save();

        res.status(200).json({
            message: "Avatar updated successfully",
            avatar: user.avatar,
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

        const file = req.files?.[0];
        const filename = file ? file.filename : null;

        const newUser = new User({
            ...req.body,
            avatar: filename,
            password: hashedPassword,
        });

        await newUser.save();

        console.log("User saved");

        await sendEmail({
            to: newUser.email,
            subject: "Welcome to Book Store",
            html: welcomeEmail(newUser),
        });

        console.log("Email sent");

        res.status(201).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

// =======================
// UPDATE USER BY ADMIN
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

// FORGOT PASSWORD
async function forgotPassword(req, res, next) {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Password",
            html: resetPasswordEmail(
                user,
                resetLink
            ),
        });

        res.json({
            message:
                "Password reset link sent successfully",
        });

    } catch (error) {
        next(error);
    }
}

// RESET PASSWORD
async function resetPassword(req, res, next) {

    try {

        const { token, password } = req.body;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(
            decoded.id,
            {
                password: hashedPassword,
            }
        );

        res.json({
            message:
                "Password reset successfully",
        });

    } catch (error) {

        return res.status(400).json({
            message:
                "Invalid or expired reset link",
        });

    }

}

// CHANGE PASSWORD
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    getProfile,
    updateProfile,
    updateAvatar,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    forgotPassword,
    changePassword,
    resetPassword
};