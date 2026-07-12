const { body } = require("express-validator");

const registerValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

const loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
];

const forgotPasswordValidation = [
    body("email").isEmail().withMessage("Valid email is required")
];

const resetPasswordOTPValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

module.exports = { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordOTPValidation };
