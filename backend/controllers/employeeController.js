
// Step 3 Employee Management APIs

// Here Admin should be able to :-

// Add employee
// View all employee
// Update employee
// Delete Employee

// Files Which will be used to make this

// controllers/employeeController.js
// routes/employeeRoutes.js
// models/Employee.js  (already exists)

const Employee = require("../models/Employee");

// Add Employee
exports.addEmployee = async(req , res)=>{
  try{
    const employee = await Employee.create(req.body);
    res.status(201).json({message:"Employee Added Successfully",employee});
  }
  catch(error){
    res.status(500).json({error:error.message});
  }
};

//Get All Employee
exports.getEmployee=async(req,res)=>{
  try{
    const employees = await Employee.find().select("-password");
    res.json(employees);
  }
  catch(error){
    res.status(500).json({error:error.message});
  }
}

// Update All Employee

exports.updateEmployee=async(req,res)=>{
  try{
    const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  );
    res.json(employee);

  }
  catch(error){
    res.status(500).json({error:error.message});
  }
}

// Delete Employee

exports.deleteEmployee = async(req,res)=>{
  try{
    await Employee.findByIdAndDelete(req.params.id);
    res.json({
      message:"Employee Deleted"
    })
  }
  catch(error){
    res.status(500).json({error:error.message});
  }
};

