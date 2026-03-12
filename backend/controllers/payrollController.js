const Payroll = require("../models/Payroll");

// Generate payroll for an employee
exports.generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, salary, deductions, bonuses } = req.body;
    
    const netSalary = salary - deductions + bonuses;
    
    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      salary,
      deductions,
      bonuses,
      netSalary
    });
    
    res.status(201).json({ 
      message: "Payroll generated successfully", 
      payroll 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payroll for a specific employee
exports.getEmployeePayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payrolls = await Payroll.find({ employeeId });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all payroll records
exports.getAllPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate("employeeId", "name email");
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
