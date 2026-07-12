const { body } = require("express-validator");

exports.employeeValidation = [

  body("name")
    .notEmpty()
    .withMessage("Employee name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .custom((value, { req }) => {
      // Required and min 6 characters for POST (adding employee)
      if (req.method === "POST" && (!value || value.length < 6)) {
        throw new Error("Password must be at least 6 characters");
      }
      // Optional but must be min 6 characters if provided for PUT (updating employee)
      if (req.method === "PUT" && value && value.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("Role must be admin or employee"),

  body("department")
    .optional()
    .isString()
    .withMessage("Department must be a string")
    .trim(),

  body("designation")
    .optional()
    .isString()
    .withMessage("Designation must be a string")
    .trim()

];