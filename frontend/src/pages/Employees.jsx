import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      fetchEmployees();
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch employees. Make sure you are an admin.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/employees", formData);
      alert("Employee added successfully!");
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", role: "employee" });
      fetchEmployees();
    } catch (err) {
      const errorMsg = err.response?.data?.error 
        ? err.response.data.error.map(e => e.msg).join(", ") 
        : err.response?.data?.message || "Failed to add employee";
      alert("Failed to add employee: " + errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await API.delete(`/employees/${id}`);
        alert("Employee deleted successfully!");
        fetchEmployees();
      } catch (err) {
        alert("Failed to delete employee");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Employees Management</h2>
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>

      <button 
        onClick={() => setShowForm(!showForm)}
        style={{ padding: "10px 20px", marginBottom: "20px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}
      >
        {showForm ? "Cancel" : "+ Add Employee"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
          <h3>Add New Employee</h3>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", cursor: "pointer" }}>
            Submit
          </button>
        </form>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Employee List ({employees.length})</h3>
          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{emp.name}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{emp.email}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{emp.role}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        style={{ padding: "5px 10px", background: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Employees;