// const Payroll = require("../models/Payroll");

// // Generate payslip for an employee
// exports.generatePayslip = async (req, res) => {
//   try {
//     const { employeeId, month, year } = req.body;
    
//     // Find payroll record for the employee
//     const payroll = await Payroll.findOne({ 
//       employeeId, 
//       month, 
//       year 
//     }).populate("employeeId", "name email");
    
//     if (!payroll) {
//       return res.status(404).json({ 
//         message: "Payroll record not found for this employee" 
//       });
//     }
    
//     res.json({
//       message: "Payslip generated successfully",
//       payslip: {
//         employee: payroll.employeeId,
//         month: payroll.month,
//         year: payroll.year,
//         salary: payroll.salary,
//         deductions: payroll.deductions,
//         bonuses: payroll.bonuses,
//         netSalary: payroll.netSalary
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get payslip for a specific employee
// exports.getPayslip = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const payrolls = await Payroll.find({ employeeId }).populate("employeeId", "name email");
//     res.json(payrolls);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const Payroll = require("../models/Payroll");


// Get Payslip for logged-in employee
exports.getMyPayslip = async (req, res) => {
  try {
    console.log("Logged in user ID:", req.user.id);

    const payroll = await Payroll.find({
      employeeId: req.user.id
    }).populate("employeeId", "name email");

    res.json(payroll);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get Payslip by ID
exports.getPayslipById = async (req, res) => {
  try {

    const payslip = await Payroll.findById(req.params.id)
      .populate("employeeId", "name email department designation");

    if (!payslip) {
      return res.status(404).json({
        message: "Payslip not found"
      });
    }

    res.json(payslip);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all payslips (admin)
exports.getAllPayslips = async (req, res) => {
  try {

    const payslips = await Payroll.find()
      .populate("employeeId", "name email");

    res.json(payslips);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};