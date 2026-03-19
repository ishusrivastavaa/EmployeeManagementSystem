import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
    salary: "",
    deductions: "0",
    bonuses: "0"
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    month: "",
    year: "",
    salary: "",
    deductions: "0",
    bonuses: "0"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      window.location.href = "/";
    } else {
      const user = userData ? JSON.parse(userData) : null;
      // Only allow admin to access this page
      if (user && user.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const empRes = await API.get("/employees");
      setEmployees(empRes.data);
      
      const payRes = await API.get("/payroll");
      setPayrolls(payRes.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to fetch data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/payroll", {
        ...formData,
        salary: parseFloat(formData.salary),
        deductions: parseFloat(formData.deductions),
        bonuses: parseFloat(formData.bonuses)
      });
      alert("Payroll generated successfully!");
      setShowForm(false);
      setFormData({ employeeId: "", month: "", year: "", salary: "", deductions: "0", bonuses: "0" });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error 
        ? err.response.data.error.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Failed to generate payroll";
      alert("Failed to generate payroll: " + errorMsg);
    }
  };
  
  // Handle edit click
  const handleEditClick = (payroll) => {
    setEditId(payroll._id);
    setEditData({
      month: payroll.month,
      year: payroll.year,
      salary: payroll.salary,
      deductions: payroll.deductions || 0,
      bonuses: payroll.bonuses || 0
    });
  };
  
  // Handle edit cancel
  const handleEditCancel = () => {
    setEditId(null);
    setEditData({ month: "", year: "", salary: "", deductions: "0", bonuses: "0" });
  };
  
  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/payroll/${editId}`, {
        ...editData,
        salary: parseFloat(editData.salary),
        deductions: parseFloat(editData.deductions),
        bonuses: parseFloat(editData.bonuses)
      });
      alert("Payroll updated successfully!");
      setEditId(null);
      setEditData({ month: "", year: "", salary: "", deductions: "0", bonuses: "0" });
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error 
        ? err.response.data.error.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Failed to update payroll";
      alert("Failed to update payroll: " + errorMsg);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Payroll Management</h2>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>

      <button 
        onClick={() => setShowForm(!showForm)}
        style={{ padding: "10px 20px", marginBottom: "20px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}
      >
        {showForm ? "Cancel" : "+ Generate Payroll"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
          <h3>Generate Payroll</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Select Employee:</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.name} - {emp.email}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Month:</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            >
              <option value="">Select Month</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Year:</label>
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Salary:</label>
            <input
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Deductions:</label>
            <input
              type="number"
              placeholder="Deductions"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Bonuses:</label>
            <input
              type="number"
              placeholder="Bonuses"
              value={formData.bonuses}
              onChange={(e) => setFormData({ ...formData, bonuses: e.target.value })}
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
            Generate Payroll
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Payroll Records ({payrolls.length})</h3>
          {payrolls.length === 0 ? (
            <p>No payroll records found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Employee</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Month</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Year</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Salary</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Deductions</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Bonuses</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Net Salary</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((pay) => (
                  <tr key={pay._id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {pay.employeeId?.name || "Unknown"}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{pay.month}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{pay.year}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{pay.salary}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{pay.deductions || 0}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{pay.bonuses || 0}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>{pay.netSalary}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <button 
                        onClick={() => handleEditClick(pay)}
                        style={{ padding: "5px 10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {/* Edit Form Modal */}
      {editId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <form onSubmit={handleEditSubmit} style={{ border: "1px solid #ccc", padding: "30px", background: "white", width: "400px" }}>
            <h3>Edit Payroll</h3>
            <div style={{ marginBottom: "10px" }}>
              <label>Month:</label>
              <select
                value={editData.month}
                onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                required
                style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
              >
                <option value="">Select Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Year:</label>
              <input
                type="number"
                placeholder="Year"
                value={editData.year}
                onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                required
                style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Salary:</label>
              <input
                type="number"
                placeholder="Salary"
                value={editData.salary}
                onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                required
                style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Deductions:</label>
              <input
                type="number"
                placeholder="Deductions"
                value={editData.deductions}
                onChange={(e) => setEditData({ ...editData, deductions: e.target.value })}
                style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Bonuses:</label>
              <input
                type="number"
                placeholder="Bonuses"
                value={editData.bonuses}
                onChange={(e) => setEditData({ ...editData, bonuses: e.target.value })}
                style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
                Update
              </button>
              <button type="button" onClick={handleEditCancel} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Payroll;