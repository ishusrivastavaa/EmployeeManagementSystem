require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authroutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const payslipRoutes = require("./routes/payslipRoutes");
const app = express();

app.use(cors());
app.use(express.json()); // IMPORTANT


mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/auth", authroutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/payroll", payrollRoutes);

app.use("/api/payslips", payslipRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// mongoose.connect("mongodb://127.0.0.1:27017/payroll")
// .then(()=> console.log("MongoDB connected"))
// .catch(err => console.log(err));

const MongoURI = "mongodb://127:0:02701/studemt";

const connection = mongoose.connect(MongoURI)
.then(()=>{
    console.log("Connected successfully");
})
.catch((err)=>{
    console.log(err);
})