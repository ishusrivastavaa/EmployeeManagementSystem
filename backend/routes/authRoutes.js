const express = require("express");
const router = express.Router();

const { register, login, forgotPassword, resetPassword } = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordOTPValidation
} = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword);
router.post("/reset-password-otp", resetPasswordOTPValidation, validate, resetPassword);

module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { register , login } = require("../controllers/authController");

// const { registerValidation, loginValidation } = require("../validators/authValidator");
// const validate = require("../middleware/validationMiddleware");

// router.post("/register", registerValidation, validate, register);

// router.post("/login", loginValidation, validate, login);

// module.exports = router;
