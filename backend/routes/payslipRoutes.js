// const express = require("express");
// const router = express.Router();

// const { generatePayslip, getPayslip } = require("../controllers/payslipController");

// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

// // Generate payslip
// router.post("/", authMiddleware, adminMiddleware, generatePayslip);

// // Get payslip by employee
// router.get("/:employeeId", authMiddleware, getPayslip);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  getMyPayslip,
  getPayslipById,
  getAllPayslips
} = require("../controllers/payslipController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// Employee can see their payslips
router.get("/my", authMiddleware, getMyPayslip);


// Admin can see all payslips
router.get("/", authMiddleware, adminMiddleware, getAllPayslips);


// Get specific payslip
router.get("/:id", authMiddleware, getPayslipById);


module.exports = router;
