const express = require("express");
const router = express.Router();

const {register , login} = require("../controllers/authController");

const { registerValidation, loginValidation } = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");

router.post("/register",registerValidation , validate , register);
router.post("/login",loginValidation , validate, login);

module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { register , login } = require("../controllers/authController");

// const { registerValidation, loginValidation } = require("../validators/authValidator");
// const validate = require("../middleware/validationMiddleware");

// router.post("/register", registerValidation, validate, register);

// router.post("/login", loginValidation, validate, login);

// module.exports = router;
