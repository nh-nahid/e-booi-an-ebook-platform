const express = require("express");

const {
    addUser,
    getUsers,
    getUser,
    getProfile,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    resetPassword,
    forgotPassword,
} = require("../controllers/usersController");

const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const avatarUpload = require("../middlewares/users/avatarUpload");

const {
    addUserValidators,
    addUserValidationHandler,
} = require("../middlewares/users/addUserValidators");


const router = express.Router();


// =========================
// AUTH ROUTES (PUBLIC)
// =========================

// register user
router.post(
    "/register",
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser
);

// login user
router.post("/login", loginUser);

// logout user
router.post("/logout", logoutUser);

// User profile
router.get( "/profile", checkLogin, getProfile);

// =========================
// USER ROUTES (PROTECTED)
// =========================

// get all users (admin or protected)
router.get("/", checkLogin, requireRole("admin"), getUsers);

// get single user
router.get("/:id", checkLogin, requireRole("admin"), getUser);

// update user
router.put(
    "/:id",
    checkLogin,
    requireRole("admin"),
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    updateUser
);

// delete user
router.delete(
    "/:id",
    checkLogin,
    requireRole("admin"),
    deleteUser
);

// forgot and reset password
router.post( "/forgot-password", forgotPassword );
router.post( "/reset-password", resetPassword );

module.exports = router;