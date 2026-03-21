const express = require("express");
const router = express.Router();

const {
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { employeeValidation } = require("../validators/employeeValidator");
const validate = require("../middleware/validationMiddleware");

router.post("/", authMiddleware, adminMiddleware, employeeValidation , validate , addEmployee);

router.get("/", authMiddleware , adminMiddleware, getEmployee);

router.put("/:id", authMiddleware , adminMiddleware, employeeValidation , validate , updateEmployee );

router.delete("/:id", authMiddleware, adminMiddleware, deleteEmployee);



module.exports = router;

