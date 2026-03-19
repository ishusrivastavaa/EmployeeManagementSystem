import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      window.location.href = "/";
    } else {
      const parsedUser = userData ? JSON.parse(userData) : null;
      setUser(parsedUser);
      fetchPayslips(parsedUser);
    }
  }, []);

  const fetchPayslips = async (currentUser) => {
    try {
      // Check user role - if admin, fetch all payslips, else fetch own payslips
      if (currentUser && currentUser.role === "admin") {
        const res = await API.get("/payslips");
        setPayslips(res.data);
      } else {
        const res = await API.get("/payslips/my");
        setPayslips(res.data);
      }
    } catch (err) {
      console.error("Error fetching payslips:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = ["", "January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    return months[parseInt(month)] || month;
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Payslips</h2>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>

      {user && (
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Viewing as: {user.name} ({user.role})
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Payslip Records ({payslips.length})</h3>
          {payslips.length === 0 ? (
            <p>No payslip records found. Generate payroll first to create payslips.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {payslips.map((payslip) => (
                <div key={payslip._id} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
                  <h4 style={{ marginTop: 0 }}>{getMonthName(payslip.month)} {payslip.year}</h4>
                  <p><strong>Employee:</strong> {payslip.employeeId?.name || "Unknown"}</p>
                  <p><strong>Email:</strong> {payslip.employeeId?.email || "N/A"}</p>
                  <hr style={{ margin: "10px 0" }} />
                  <p><strong>Salary:</strong> ${payslip.salary}</p>
                  <p><strong>Deductions:</strong> ${payslip.deductions || 0}</p>
                  <p><strong>Bonuses:</strong> ${payslip.bonuses || 0}</p>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#28a745" }}>
                    Net Salary: ${payslip.netSalary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Payslips;