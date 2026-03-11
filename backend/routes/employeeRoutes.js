const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, adminMiddleware, addEmployee);
router.get("/", authMiddleware, adminMiddleware, getEmployee);
router.put("/:id", authMiddleware, adminMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEmployee);


module.exports = router;

