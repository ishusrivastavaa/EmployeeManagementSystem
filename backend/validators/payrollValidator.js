const { body } = require("express-validator");

exports.payrollValidation = [

  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("month")
    .notEmpty()
    .withMessage("Month is required"),

  body("year")
    .isNumeric()
    .withMessage("Year must be numeric"),

  body("salary")
    .isNumeric()
    .withMessage("Salary must be numeric"),

  body("deductions")
    .optional()
    .isNumeric()
    .withMessage("Deductions must be numeric"),

  body("bonuses")
    .optional()
    .isNumeric()
    .withMessage("Bonuses must be numeric")

];