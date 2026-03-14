const { body } = require("express-validator");

exports.employeeValidation = [

  body("name")
    .notEmpty()
    .withMessage("Employee name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("Role must be admin or employee")

];