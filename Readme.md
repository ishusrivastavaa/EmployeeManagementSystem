# Employee Payroll Management System

A full-stack Employee Management and Payroll System built with the MERN Stack (MongoDB, Express, React, Node.js).

##  Project Overview

This is a complete payroll management system that allows organizations to manage employees, generate payroll, and handle payslips. The system implements role-based access control with two user roles: Admin and Employee.

##  Project Structure

```
EMP (Employee Management System)
├── backend/                 # Node.js + Express Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & validation middleware
│   ├── models/             # Mongoose data models
│   ├── routes/             # API route definitions
│   ├── validators/         # Input validation
│   ├── server.js           # Express server entry point
│   └── .env                # Environment variables
│
├── frontend/               # React + Vite Frontend
│   ├── src/
│   │   ├── pages/          # React page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # React entry point
│   └── index.html          # HTML template
│
└── README.md               # Project documentation
```

##  Features

### Admin Capabilities
- ✅ Add new employees
- ✅ View all employees
- ✅ Update employee information (via Edit Modal)
- ✅ Support for Employee Department & Designation fields
- ✅ Delete employees
- ✅ Generate payroll for employees
- ✅ View all payroll records
- ✅ Edit/Modify existing payroll
- ✅ View all employees' payslips
- ✅ Forgot & Reset Password Flow via 6-digit OTP verification

### Employee Capabilities
- ✅ View own payslips
- ✅ View own payroll information
- ❌ Cannot access admin features

##  Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JSON Web Tokens (JWT)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Nodemailer** - Email delivery service (for OTP)

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/ishusrivastavaa/EmployeeManagementSystem.git>
   cd EMP
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. **Backend (.env)**
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/payroll
   JWT_SECRET=your-secret-key

   # SMTP Mail Server Configuration (for Password Reset OTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

2. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   node server.js
   ```
   Server runs on: http://localhost:5000

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

## 📖 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Generate & send 6-digit OTP to user |
| POST | `/api/auth/reset-password-otp` | Verify OTP and reset password |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees (Admin) |
| POST | `/api/employees` | Add employee (Admin) |
| PUT | `/api/employees/:id` | Update employee (Admin) |
| DELETE | `/api/employees/:id` | Delete employee (Admin) |

### Payroll
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payroll` | Get all payroll (Admin) |
| POST | `/api/payroll` | Generate payroll (Admin) |
| PUT | `/api/payroll/:id` | Update payroll (Admin) |
| GET | `/api/payroll/:employeeId` | Get employee payroll |

### Payslips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payslips` | Get all payslips (Admin) |
| GET | `/api/payslips/my` | Get own payslips (Employee) |
| GET | `/api/payslips/:id` | Get specific payslip |

##  User Roles

The first user registered automatically becomes **Admin**. All subsequent users are registered as **Employees**.

To change a user's role manually, access MongoDB and update the `role` field in the Employee collection.

## 📝 Sample Data

### Register Admin
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Register Employee
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Generate Payroll (Admin only)
```json
{
  "employeeId": "<employee-id>",
  "month": "03",
  "year": "2026",
  "salary": 50000,
  "deductions": 2000,
  "bonuses": 5000
}
```

## 🧪 Testing with Postman

1. Register/Login to get JWT token
2. Add the token to headers: `Authorization: Bearer <token>`
3. Test various endpoints based on your role

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

**Ishu Srivastava**
- B.Tech Computer Science Engineering (GLA University)

## 🙏 Acknowledgments

- MongoDB for database
- Express.js for backend framework
- React for frontend library
- Vite for fast development