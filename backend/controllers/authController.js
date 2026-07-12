const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register

exports.register = async(req,res)=>{
    try{
        const { name , email , password}= req.body;
        
        const userExist = await Employee.findOne({email});
        if(userExist){
            return res.status(400).json({message:"user already exist"});
        }
        
        // Check if this is the first user - make them admin
        const userCount = await Employee.countDocuments();
        const role = userCount === 0 ? "admin" : "employee";
        
        const hashedpassword = await bcrypt.hash(password , 10);

        const user = await Employee.create({
            name,
            email,
            password:hashedpassword,
            role
        })
        res.status(201).json(
        {
         message: "User registered successfully",
         userId :user._id
        });



    }
    catch(error){
        res.status(500).json({error: error.message});
    }

};

// Login

exports.login = async(req,res)=>{

    try{
        const { email , password} = req.body;
        const user = await  Employee.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email"});
        }
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Password"});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        res.json({
            message:"Login Successfully",
            token,
            user:
            {
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        
        })
    }
     catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Configure nodemailer transporter reading from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Employee.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "No account with that email address exists." });
    }

    // Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and expiry (10 minutes)
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 600000;
    
    await user.save();

    console.log("----------------------------------------");
    console.log("PASSWORD RESET OTP REQUEST:");
    console.log("User:", email);
    console.log("OTP:", otp);
    console.log("----------------------------------------");

    let emailSent = false;
    
    // Check if SMTP credentials exist in .env and attempt sending
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: `"EMS Payroll Support" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "EMS Payroll - Password Reset OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #3b82f6; margin-top: 0; text-align: center;">One-Time Password (OTP)</h2>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset for your Employee Management and Payroll System account. Please use the following One-Time Password (OTP) to complete the reset process:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #f1f5f9; color: #1e293b; padding: 15px 30px; font-size: 2.25rem; font-weight: bold; letter-spacing: 0.25em; border-radius: 6px; display: inline-block; border: 1px solid #cbd5e1;">${otp}</div>
              </div>
              <p style="color: #64748b; font-size: 0.875rem; text-align: center; margin-bottom: 0;">This OTP is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          `
        });
        emailSent = true;
      } catch (mailError) {
        console.error("Nodemailer failed to send email:", mailError.message);
      }
    }

    res.json({
      message: emailSent 
        ? "One-Time Password (OTP) sent to your email address." 
        : "OTP generated (email service offline). Check console.",
      emailSent
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await Employee.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};