const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { unlink } = require("fs");
const path = require("path");
const sendEmail = require("../utils/sendEmail");
const welcomeEmail = require("../emails/templates/welcomeEmail");
const resetPasswordEmail = require("../emails/templates/resetPasswordEmail");
const fs = require("fs");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { compareToken, hashToken } = require("../utils/token");
const setRefreshCookie = require("../utils/setRefreshCookie");

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
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

// UPDATE PROFILE
async function updateProfile(req, res, next) {
  try {
    const { name, phone, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.bio = bio ?? user.bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
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
        user.avatar,
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
// DELETE AVATAR
async function deleteAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.avatar) {
      return res.status(400).json({
        message: "No avatar found",
      });
    }

    const avatarPath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      "avatars",
      user.avatar,
    );

    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    user.avatar = null;

    await user.save();

    return res.status(200).json({
      message: "Avatar deleted successfully",
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
    const {
      name,
      email,
      password,
      role = "user",
      adminCode,
    } = req.body;

    // Validate admin access
    if (role === "admin") {
      if (!adminCode) {
        return res.status(400).json({
          message: "Admin access code is required.",
        });
      }

      if (adminCode !== process.env.ADMIN_ACCESS_CODE) {
        return res.status(403).json({
          message: "Invalid admin access code.",
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Avatar upload (optional)
    const file = req.files?.[0];
    const filename = file ? file.filename : null;

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar: filename,
    });

    // Send welcome email (do not fail registration if email fails)
    try {
      await sendEmail({
        to: newUser.email,
        subject: "Welcome to Book Store",
        html: welcomeEmail(newUser),
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:");
      console.error(emailError);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addUser,
};

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
          user.avatar,
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
        user.avatar,
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
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Hash & Store Refresh Token
    user.refreshToken = await hashToken(refreshToken);
    await user.save();

    // Set Refresh Token Cookie
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
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

// =======================
// LOGOUT USER
// =======================
async function logoutUser(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await User.findOne({
        refreshToken,
      }).select("+refreshToken");

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    next(error);
  }
}

// REFRESH TOKEN
async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatched = await compareToken(refreshToken, user.refreshToken);

    if (!isMatched) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Rotate Refresh Token
    const newAccessToken = generateAccessToken(user);

    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = await hashToken(newRefreshToken);

    await user.save();

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
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
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html: resetPasswordEmail(user, resetLink),
    });

    res.json({
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

// RESET PASSWORD
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired reset link",
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

    const isMatch = await bcrypt.compare(currentPassword, user.password);

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
  deleteAvatar,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  changePassword,
  resetPassword,
};
