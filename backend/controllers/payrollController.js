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
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;
    
    // If admin, allow viewing any employee's payroll
    // If employee, only allow viewing their own payroll
    if (currentUserRole !== "admin" && currentUserId !== employeeId) {
      return res.status(403).json({ message: "Access denied. You can only view your own payroll." });
    }
    
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

// Update payroll (admin only)
exports.updatePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year, salary, deductions, bonuses } = req.body;
    
    const netSalary = salary - deductions + bonuses;
    
    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { month, year, salary, deductions, bonuses, netSalary },
      { new: true }
    ).populate("employeeId", "name email");
    
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }
    
    res.json({ message: "Payroll updated successfully", payroll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// {
//   "employeeId": "69b1b25f535a08187304138b",
//   "month": "03",
//   "year":"2026",
//   "salary": 47000,
//   "deductions": 2000,
//   "bonuses":8000
// }

// {
//   "name":"Jane Smith Updated",
//   "email":"admin@test.com",
//   "password":"admin123"
// }
// {
//   "name":"shashank",
//   "email":"shashank2005@gmail.com",
//   "password":"shashank2005"
// }