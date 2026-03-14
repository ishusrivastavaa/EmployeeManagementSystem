// // const express = require("express");
// // const router = express.Router();

// // const { generatePayroll } = require("../controllers/payrollController");

// // const authMiddleware = require("../middleware/authmiddleware");
// // const adminMiddleware = require("../middleware/adminMiddleware");

// // router.post("/", authMiddleware, adminMiddleware, generatePayroll);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   generatePayroll,
//   getEmployeePayroll,
//   getAllPayroll
// } = require("../controllers/payrollController");

// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware =require("../middleware/adminMiddleware");

// const { payrollValidation } = require("../validators/payrollValidator");
// const validate = require("../middleware/validationMiddleware");

// // Generate payroll (admin only)
// router.post("/", authMiddleware, adminMiddleware,payrollValidation, validate, generatePayroll);


// // Get payroll of specific employee
// router.get("/:employeeId", authMiddleware, getEmployeePayroll);


// // Get all payroll records
// router.get("/", authMiddleware, adminMiddleware, getAllPayroll);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  generatePayroll,
  getEmployeePayroll,
  getAllPayroll
} = require("../controllers/payrollController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { payrollValidation } = require("../validators/payrollValidator");
const validate = require("../middleware/validationMiddleware");


// Generate payroll (admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  payrollValidation,
  validate,
  generatePayroll
);


// Get payroll of specific employee
router.get("/:employeeId", authMiddleware, getEmployeePayroll);


// Get all payroll records
router.get("/", authMiddleware, adminMiddleware, getAllPayroll);

module.exports = router;