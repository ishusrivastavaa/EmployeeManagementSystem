import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ employees: 0, payrolls: 0, payslips: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    } else {
      // Try to get user info from login response stored in localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: "10px 20px", background: "#dc3545", color: "white", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      
      <p>Welcome to the Payroll Management System</p>
      
      {user && (
        <p style={{ color: "#666" }}>Logged in as: {user.name} ({user.role})</p>
      )}
      
      {/* Admin Dashboard */}
      {user?.role === "admin" && (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
          <Link to="/employees" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #ccc", padding: "30px", minWidth: "200px", cursor: "pointer", background: "#f8f9fa" }}>
              <h3>Employees</h3>
              <p>Manage employee records</p>
            </div>
          </Link>
          
          <Link to="/payroll" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #ccc", padding: "30px", minWidth: "200px", cursor: "pointer", background: "#f8f9fa" }}>
              <h3>Payroll</h3>
              <p>Generate and manage payroll</p>
            </div>
          </Link>
          
          <Link to="/payslips" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #ccc", padding: "30px", minWidth: "200px", cursor: "pointer", background: "#f8f9fa" }}>
              <h3>Payslips</h3>
              <p>View all employees' payslips</p>
            </div>
          </Link>
        </div>
      )}
      
      {/* Employee Dashboard */}
      {user?.role === "employee" && (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
          <Link to="/payslips" style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #ccc", padding: "30px", minWidth: "200px", cursor: "pointer", background: "#f8f9fa" }}>
              <h3>My Payslips</h3>
              <p>View your own payslips</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;