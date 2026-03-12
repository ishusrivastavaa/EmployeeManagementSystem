const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Payroll", payrollSchema);
