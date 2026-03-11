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
        const hashedpassword = await bcrypt.hash(password , 10);

        const user = await Employee.create({
            name,
            email,
            password:hashedpassword
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