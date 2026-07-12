const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true  
  },

  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee"
  },

  department: {
    type: String,
    default: ""
  },

  designation: {
    type: String,
    default: ""
  },

  resetOTP: {
    type: String
  },

  resetOTPExpires: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);