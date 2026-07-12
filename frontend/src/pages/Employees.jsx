import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  CloseIcon,
  ChevronLeftIcon
} from "../components/Icons";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    designation: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
      fetchEmployees();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    setError("");
    try {
      const response = await API.get("/employees");
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees list. Please make sure you are logged in as an admin.");
    } finally {
      setLoading(false);
    }
  };

  const closeFormModal = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "employee",
      department: "",
      designation: "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        const payload = { ...formData };
        if (!payload.password) {
          delete payload.password;
        }
        await API.put("/employees/" + editId, payload);
        setSuccess("Employee updated successfully!");
      } else {
        await API.post("/employees", formData);
        setSuccess("Employee registered successfully!");
      }
      
      // Close form and refresh after a brief success delay
      setTimeout(() => {
        closeFormModal();
        fetchEmployees();
      }, 1000);
    } catch (err) {
      let errorMessage = isEditing ? "Failed to update employee" : "Failed to add employee";
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

  const handleDelete = async (id) => {
    setError("");
    try {
      await API.delete("/employees/" + id);
      fetchEmployees();
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
    }
  };

  // Filter employees based on search input (name or email)
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
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
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>Employees Directory</h1>
        </div>

        <button 
          onClick={() => {
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: "", email: "", password: "", role: "employee", department: "", designation: "" });
            setShowForm(true);
          }} 
          className="btn btn-primary"
        >
          <PlusIcon style={{ width: "16px", height: "16px" }} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Inline Notifications */}
      {error && !showForm && (
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
            placeholder="Search by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500", whiteSpace: "nowrap" }}>
          Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> employees
        </div>
      </div>

      {/* Employee List Grid/Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading directory...</p>
        </div>
      ) : (
        <div className="table-container">
          {filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "2rem", height: "2rem" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h4>No employees found</h4>
              <p>Try searching for a different name, email, or register a new staff member.</p>
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
                  <th>Employee Info</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div 
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "var(--primary-light)",
                            color: "var(--primary-color)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "600",
                            fontSize: "0.85rem"
                          }}
                        >
                          {emp.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                        </div>
                        <div>
                          <div className="td-bold">{emp.name}</div>
                          {(emp.designation || emp.department) && (
                            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.125rem" }}>
                              {emp.designation || "No Title"}{emp.department ? ` • ${emp.department}` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{emp.email}</td>
                    <td>
                      <span className={`badge ${emp.role === "admin" ? "badge-admin" : "badge-employee"}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditId(emp._id);
                            setFormData({
                              name: emp.name,
                              email: emp.email,
                              password: "",
                              role: emp.role,
                              department: emp.department || "",
                              designation: emp.designation || ""
                            });
                            setShowForm(true);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ color: "var(--primary-color)", borderColor: "rgba(59, 130, 246, 0.2)", backgroundColor: "var(--primary-light)" }}
                          title="Edit Employee"
                          type="button"
                        >
                          <EditIcon style={{ width: "14px", height: "14px" }} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(emp._id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: "var(--danger)", borderColor: "rgba(239, 68, 68, 0.2)", backgroundColor: "var(--danger-light)" }}
                          title="Delete Employee"
                          type="button"
                        >
                          <TrashIcon style={{ width: "14px", height: "14px" }} />
                          <span>Delete</span>
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

      {/* Add Employee Dialog Overlay */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? "Edit Employee Profile" : "Register New Employee"}</h3>
              <button className="modal-close" onClick={closeFormModal} type="button">
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
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="E.g. Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="jane.smith@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {isEditing ? "Change Password" : "Temporary Password"}
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={isEditing ? "Leave blank to keep unchanged" : "Min. 6 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditing}
                  minLength={!isEditing || formData.password ? 6 : undefined}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Access Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="employee">Standard Employee</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g. Engineering"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="E.g. Software Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeFormModal}
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
                      {isEditing ? "Saving..." : "Registering..."}
                    </>
                  ) : (
                    isEditing ? "Save Changes" : "Register Employee"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteConfirmId && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-content" style={{ maxWidth: "420px" }}>
            <h3 style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              Confirm Deletion
            </h3>
            <p style={{ margin: "1rem 0", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Are you sure you want to remove this employee from the payroll database? This action is permanent and cannot be reversed.
            </p>
            <div className="modal-footer" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Keep Employee
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  handleDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
