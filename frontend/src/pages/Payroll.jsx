import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  PlusIcon,
  EditIcon,
  SearchIcon,
  CloseIcon,
  ChevronLeftIcon,
  DollarIcon
} from "../components/Icons";

const monthsList = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: new Date().getFullYear().toString(),
    salary: "",
    deductions: "0",
    bonuses: "0",
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [editData, setEditData] = useState({
    month: "",
    year: "",
    salary: "",
    deductions: "0",
    bonuses: "0",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      navigate("/");
    } else {
      const user = userData ? JSON.parse(userData) : null;
      if (user && user.role !== "admin") {
        navigate("/dashboard");
        return;
      }
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    setError("");
    try {
      const empResponse = await API.get("/employees");
      setEmployees(empResponse.data);
      
      const payResponse = await API.get("/payroll");
      setPayrolls(payResponse.data);
    } catch (err) {
      setError("Failed to load payroll directory. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      await API.post("/payroll", {
        employeeId: formData.employeeId,
        month: formData.month,
        year: formData.year,
        salary: parseFloat(formData.salary),
        deductions: parseFloat(formData.deductions),
        bonuses: parseFloat(formData.bonuses),
      });
      
      setSuccess("Payroll statement generated successfully!");
      setFormData({
        employeeId: "",
        month: "",
        year: new Date().getFullYear().toString(),
        salary: "",
        deductions: "0",
        bonuses: "0",
      });
      
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
        fetchData();
      }, 1000);
    } catch (err) {
      let errorMessage = "Failed to generate payroll";
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error.map((e) => e.msg).join(", ");
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (payroll) => {
    setEditId(payroll._id);
    setEditData({
      month: payroll.month,
      year: payroll.year.toString(),
      salary: payroll.salary.toString(),
      deductions: (payroll.deductions || 0).toString(),
      bonuses: (payroll.bonuses || 0).toString(),
    });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setError("");
    setSuccess("");
    setEditData({ month: "", year: "", salary: "", deductions: "0", bonuses: "0" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      await API.put("/payroll/" + editId, {
        month: editData.month,
        year: editData.year,
        salary: parseFloat(editData.salary),
        deductions: parseFloat(editData.deductions),
        bonuses: parseFloat(editData.bonuses),
      });
      
      setSuccess("Payroll updated successfully!");
      
      setTimeout(() => {
        setEditId(null);
        setSuccess("");
        fetchData();
      }, 1000);
    } catch (err) {
      setError("Failed to update payroll. Please check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  const getMonthName = (monthValue) => {
    const month = monthsList.find((m) => m.value === monthValue);
    return month ? month.label : monthValue;
  };

  const formatCurrency = (amount) => {
    return "$" + Number(amount).toLocaleString();
  };

  // Filter payroll records by employee name
  const filteredPayrolls = payrolls.filter((pay) => {
    const empName = pay.employeeId?.name || "Unknown";
    return empName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {/* Page Header */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.75rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border-color)"
        }}
      >
        <div>
          <Link to="/dashboard" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
            <ChevronLeftIcon style={{ width: "16px", height: "16px" }} />
            <span>Dashboard</span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Payroll Operations</h1>
        </div>

        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <PlusIcon style={{ width: "16px", height: "16px" }} />
          <span>Generate Payroll</span>
        </button>
      </div>

      {/* Inline Notifications */}
      {error && !showForm && !editId && (
        <div 
          style={{
            backgroundColor: "var(--danger-light)",
            color: "var(--danger)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            fontWeight: "500"
          }}
        >
          {error}
        </div>
      )}

      {/* Control panel: search bar & stats summary */}
      <div className="search-control-container">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            className="form-input"
            placeholder="Search payroll by employee name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500", whiteSpace: "nowrap" }}>
          Found <strong>{filteredPayrolls.length}</strong> payroll records
        </div>
      </div>

      {/* Payroll List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payroll records...</p>
        </div>
      ) : (
        <div className="table-container">
          {filteredPayrolls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <DollarIcon style={{ width: "2rem", height: "2rem" }} />
              </div>
              <h4>No payroll records found</h4>
              <p>Try searching for a different employee name, or create a monthly payroll entry.</p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="btn btn-outline btn-sm">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Period</th>
                  <th>Basic Salary</th>
                  <th>Deductions</th>
                  <th>Bonuses</th>
                  <th style={{ fontWeight: "700" }}>Net Salary</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.map((pay) => (
                  <tr key={pay._id}>
                    <td>
                      <div className="td-bold">{pay.employeeId?.name || "Unknown"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{pay.employeeId?.email || "N/A"}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "500" }}>{getMonthName(pay.month)}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Year {pay.year}</div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{formatCurrency(pay.salary)}</td>
                    <td style={{ color: "var(--danger)" }}>-{formatCurrency(pay.deductions || 0)}</td>
                    <td style={{ color: "var(--success)" }}>+{formatCurrency(pay.bonuses || 0)}</td>
                    <td className="td-bold" style={{ color: "var(--primary-color)" }}>{formatCurrency(pay.netSalary)}</td>
                    <td>
                      <div className="td-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleEditClick(pay)}
                          className="btn btn-outline btn-sm"
                          type="button"
                        >
                          <EditIcon style={{ width: "14px", height: "14px" }} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Generate Payroll Dialog Overlay */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "560px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Generate New Payroll</h3>
              <button className="modal-close" onClick={() => setShowForm(false)} type="button">
                <CloseIcon />
              </button>
            </div>

            {error && (
              <div 
                style={{
                  backgroundColor: "var(--danger-light)",
                  color: "var(--danger)",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                  border: "1px solid rgba(239, 68, 68, 0.1)"
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div 
                style={{
                  backgroundColor: "var(--success-light)",
                  color: "var(--success)",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                  border: "1px solid rgba(16, 185, 129, 0.1)"
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Employee</label>
                <select
                  className="form-select"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                >
                  <option value="">Choose employee...</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Month</label>
                  <select
                    className="form-select"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  >
                    <option value="">Choose month...</option>
                    {monthsList.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Basic Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="E.g. 5000"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deductions ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bonuses ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={formData.bonuses}
                    onChange={(e) => setFormData({ ...formData, bonuses: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px", borderTopColor: "white", marginRight: "6px" }}></div>
                      Generating...
                    </>
                  ) : (
                    "Generate Payroll"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payroll Dialog Overlay */}
      {editId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Payroll Record</h3>
              <button className="modal-close" onClick={handleEditCancel} type="button">
                <CloseIcon />
              </button>
            </div>

            {error && (
              <div 
                style={{
                  backgroundColor: "var(--danger-light)",
                  color: "var(--danger)",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                  border: "1px solid rgba(239, 68, 68, 0.1)"
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div 
                style={{
                  backgroundColor: "var(--success-light)",
                  color: "var(--success)",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8125rem",
                  marginBottom: "1rem",
                  border: "1px solid rgba(16, 185, 129, 0.1)"
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Month</label>
                  <select
                    className="form-select"
                    value={editData.month}
                    onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                    required
                  >
                    <option value="">Select Month</option>
                    {monthsList.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editData.year}
                    onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Basic Salary ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editData.salary}
                  onChange={(e) => setEditData({ ...editData, salary: e.target.value })}
                  required
                  min="0"
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Deductions ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editData.deductions}
                    onChange={(e) => setEditData({ ...editData, deductions: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bonuses ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editData.bonuses}
                    onChange={(e) => setEditData({ ...editData, bonuses: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px", borderTopColor: "white", marginRight: "6px" }}></div>
                      Updating...
                    </>
                  ) : (
                    "Update Statement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
