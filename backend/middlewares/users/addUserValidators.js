const { check, validationResult } = require("express-validator");
const User = require('../../models/User');
const { unlink } = require("fs");
const path = require("path");
const createError = require("http-errors");

const addUserValidators = [

    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anything other than alphabet")
        .trim(),

    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });

            if (user) {
                throw new Error("Email already in use!");
            }
            return true;
        }),

/*
    check("mobile")
        .isMobilePhone("bn-BD", {
            strictMode: true,
        })
        .withMessage("Mobile number must be a valid Bangladeshi mobile number")
        .custom(async (value) => {
            const user = await User.findOne({ mobile: value });

            if (user) {
                throw new Error("Mobile number already in use!");
            }
            return true;
        }),
*/

    check("password")
        .isStrongPassword()
        .withMessage(
            "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
        ),
];

const addUserValidationHandler = function (req, res, next) {

    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        return next();
    }

    // delete uploaded file if validation fails
    if (req.file) {
        const { filename } = req.file;

        unlink(
            path.join(__dirname, `/../public/uploads/avatars/${filename}`),
            (err) => {
                if (err) console.log(err);
            }
        );
    }

    return res.status(400).json({
        errors: mappedErrors,
    });
};

module.exports = {
    addUserValidators,
    addUserValidationHandler
};