// =====================================================
// EMPLOYEES PAGE - Simple and Easy to Understand
// =====================================================

// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Import navigation and API
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

// =====================================================
// COMPONENT: Employees Management Page
// =====================================================
function Employees() {
    // ------------------------------------------
    // STEP 1: Define state variables
    // ------------------------------------------
    
    // employees - array to store list of employees
    const [employees, setEmployees] = useState([]);
    
    // showForm - boolean to show/hide the add employee form
    const [showForm, setShowForm] = useState(false);
    
    // formData - object to store form input values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "employee"
    });
    
    // loading - shows if data is being loaded
    const [loading, setLoading] = useState(true);
    
    // error - stores error messages
    const [error, setError] = useState("");
    
    // submitting - shows if form is being submitted
    const [submitting, setSubmitting] = useState(false);
    
    // navigate - used to redirect to other pages
    const navigate = useNavigate();

    // ------------------------------------------
    // STEP 2: Run when component loads
    // ------------------------------------------
    useEffect(function() {
        // Check if user is logged in and is admin
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (!token) {
            // No token - redirect to login
            navigate("/");
        } 
        else {
            // Check if user is admin
            const user = userData ? JSON.parse(userData) : null;
            if (user && user.role !== "admin") {
                // Not admin - redirect to dashboard
                navigate("/dashboard");
                return;
            }
            // Fetch employees list
            fetchEmployees();
        }
    }, [navigate]);

    // ------------------------------------------
    // STEP 3: Fetch employees from server
    // ------------------------------------------
    const fetchEmployees = async function() {
        try {
            const response = await API.get("/employees");
            setEmployees(response.data);
            setLoading(false);
        } 
        catch (err) {
            setError("Failed to fetch employees. Make sure you are an admin.");
            setLoading(false);
        }
    };

    // ------------------------------------------
    // STEP 4: Handle form submission (Add Employee)
    // ------------------------------------------
    const handleSubmit = async function(e) {
        // Prevent page refresh
        e.preventDefault();
        setSubmitting(true);
        
        try {
            // Send data to server
            await API.post("/employees", formData);
            alert("Employee added successfully!");
            
            // Hide form and reset data
            setShowForm(false);
            setFormData({ name: "", email: "", password: "", role: "employee" });
            
            // Refresh employee list
            fetchEmployees();
        } 
        catch (err) {
            // Show error message
            let errorMessage = "Failed to add employee";
            if (err.response && err.response.data) {
                if (err.response.data.error) {
                    errorMessage = err.response.data.error.map(e => e.msg).join(", ");
                } 
                else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            }
            alert("Error: " + errorMessage);
        }
        finally {
            setSubmitting(false);
        }
    };

    // ------------------------------------------
    // STEP 5: Handle delete employee
    // ------------------------------------------
    const handleDelete = async function(id) {
        // Ask for confirmation
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                // Send delete request to server
                await API.delete("/employees/" + id);
                alert("Employee deleted successfully!");
                
                // Refresh the list
                fetchEmployees();
            } 
            catch (err) {
                alert("Failed to delete employee");
            }
        }
    };

    // ------------------------------------------
    // STEP 6: Render the page
    // ------------------------------------------
    return (
        <div className="page-container">
            
            {/* Header */}
            <div className="page-header">
                <div>
                    <Link to="/dashboard" className="back-link">Back</Link>
                    <h1 className="page-title">Employees Management</h1>
                </div>
                
                <button onClick={function() { setShowForm(!showForm); }} className="btn btn-primary">
                    {showForm ? "Cancel" : "+ Add Employee"}
                </button>
            </div>

            {/* Add Employee Form */}
            {showForm && (
                <div className="card" style={{marginBottom: "20px"}}>
                    <h3>Add New Employee</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                            
                            {/* Name Input */}
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={function(e) { 
                                        setFormData({...formData, name: e.target.value}); 
                                    }}
                                    required
                                />
                            </div>
                            
                            {/* Email Input */}
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={function(e) { 
                                        setFormData({...formData, email: e.target.value}); 
                                    }}
                                    required
                                />
                            </div>
                            
                            {/* Password Input */}
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={function(e) { 
                                        setFormData({...formData, password: e.target.value}); 
                                    }}
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            {/* Role Select */}
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    className="form-select"
                                    value={formData.role}
                                    onChange={function(e) { 
                                        setFormData({...formData, role: e.target.value}); 
                                    }}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary" style={{marginTop: "10px"}} disabled={submitting}>
                            {submitting ? "Adding..." : "Add Employee"}
                        </button>
                    </form>
                </div>
            )}

            {/* Error Message */}
            {error && <p style={{color: "red"}}>{error}</p>}

            {/* Employee List */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card">
                    <h3>Employee List ({employees.length})</h3>
                    
                    {employees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        <table style={{width: "100%", borderCollapse: "collapse"}}>
                            <thead>
                                <tr style={{background: "#f8f9fa", textAlign: "left"}}>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Name</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Email</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Role</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(function(emp) {
                                    return (
                                        <tr key={emp._id}>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>{emp.name}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>{emp.email}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>
                                                <span className={"badge " + (emp.role === "admin" ? "badge-admin" : "badge-employee")}>
                                                    {emp.role}
                                                </span>
                                            </td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>
                                                <button onClick={function() { handleDelete(emp._id); }} className="btn btn-danger btn-sm">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

// Export this component to be used in other files
export default Employees;
