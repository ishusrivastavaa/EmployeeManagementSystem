// =====================================================
// PAYROLL PAGE - Simple and Easy to Understand
// =====================================================

// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Import navigation and API
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

// List of months for dropdown
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

// =====================================================
// COMPONENT: Payroll Management Page
// =====================================================
function Payroll() {
    // ------------------------------------------
    // STEP 1: Define state variables
    // ------------------------------------------
    
    // employees - array to store list of employees
    const [employees, setEmployees] = useState([]);
    
    // payrolls - array to store list of payroll records
    const [payrolls, setPayrolls] = useState([]);
    
    // formData - object to store form input values
    const [formData, setFormData] = useState({
        employeeId: "",
        month: "",
        year: new Date().getFullYear().toString(),
        salary: "",
        deductions: "0",
        bonuses: "0"
    });
    
    // showForm - boolean to show/hide the generate payroll form
    const [showForm, setShowForm] = useState(false);
    
    // loading - shows if data is being loaded
    const [loading, setLoading] = useState(true);
    
    // submitting - shows if form is being submitted
    const [submitting, setSubmitting] = useState(false);
    
    // editId - stores the ID of payroll being edited (null if not editing)
    const [editId, setEditId] = useState(null);
    
    // editData - stores the data being edited
    const [editData, setEditData] = useState({
        month: "",
        year: "",
        salary: "",
        deductions: "0",
        bonuses: "0"
    });
    
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
            // Fetch data
            fetchData();
        }
    }, [navigate]);

    // ------------------------------------------
    // STEP 3: Fetch employees and payroll from server
    // ------------------------------------------
    const fetchData = async function() {
        try {
            // Get employees list
            const empResponse = await API.get("/employees");
            setEmployees(empResponse.data);
            
            // Get payroll list
            const payResponse = await API.get("/payroll");
            setPayrolls(payResponse.data);
            
            setLoading(false);
        } 
        catch (err) {
            alert("Failed to fetch data");
            setLoading(false);
        }
    };

    // ------------------------------------------
    // STEP 4: Handle form submission (Generate Payroll)
    // ------------------------------------------
    const handleSubmit = async function(e) {
        // Prevent page refresh
        e.preventDefault();
        setSubmitting(true);
        
        try {
            // Send data to server
            await API.post("/payroll", {
                employeeId: formData.employeeId,
                month: formData.month,
                year: formData.year,
                salary: parseFloat(formData.salary),
                deductions: parseFloat(formData.deductions),
                bonuses: parseFloat(formData.bonuses)
            });
            
            alert("Payroll generated successfully!");
            
            // Hide form and reset data
            setShowForm(false);
            setFormData({
                employeeId: "",
                month: "",
                year: new Date().getFullYear().toString(),
                salary: "",
                deductions: "0",
                bonuses: "0"
            });
            
            // Refresh the list
            fetchData();
        } 
        catch (err) {
            // Show error message
            let errorMessage = "Failed to generate payroll";
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
    // STEP 5: Handle edit button click
    // ------------------------------------------
    const handleEditClick = function(payroll) {
        // Set the ID of payroll being edited
        setEditId(payroll._id);
        
        // Set the edit data
        setEditData({
            month: payroll.month,
            year: payroll.year.toString(),
            salary: payroll.salary.toString(),
            deductions: (payroll.deductions || 0).toString(),
            bonuses: (payroll.bonuses || 0).toString()
        });
    };

    // ------------------------------------------
    // STEP 6: Handle cancel edit
    // ------------------------------------------
    const handleEditCancel = function() {
        setEditId(null);
        setEditData({ month: "", year: "", salary: "", deductions: "0", bonuses: "0" });
    };

    // ------------------------------------------
    // STEP 7: Handle submit edit
    // ------------------------------------------
    const handleEditSubmit = async function(e) {
        e.preventDefault();
        
        try {
            // Send update request
            await API.put("/payroll/" + editId, {
                month: editData.month,
                year: editData.year,
                salary: parseFloat(editData.salary),
                deductions: parseFloat(editData.deductions),
                bonuses: parseFloat(editData.bonuses)
            });
            
            alert("Payroll updated successfully!");
            
            // Clear edit state
            setEditId(null);
            setEditData({ month: "", year: "", salary: "", deductions: "0", bonuses: "0" });
            
            // Refresh the list
            fetchData();
        } 
        catch (err) {
            alert("Failed to update payroll");
        }
    };

    // ------------------------------------------
    // STEP 8: Get month name from value
    // ------------------------------------------
    const getMonthName = function(monthValue) {
        const month = monthsList.find(function(m) { return m.value === monthValue; });
        return month ? month.label : monthValue;
    };

    // ------------------------------------------
    // STEP 9: Render the page
    // ------------------------------------------
    return (
        <div className="page-container">
            
            {/* Header */}
            <div className="page-header">
                <div>
                    <Link to="/dashboard" className="back-link">Back</Link>
                    <h1 className="page-title">Payroll Management</h1>
                </div>
                
                <button onClick={function() { setShowForm(!showForm); }} className="btn btn-primary">
                    {showForm ? "Cancel" : "Generate Payroll"}
                </button>
            </div>

            {/* Generate Payroll Form */}
            {showForm && (
                <div className="card" style={{marginBottom: "20px"}}>
                    <h3>Generate New Payroll</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px"}}>
                            
                            {/* Employee Select */}
                            <div className="form-group">
                                <label className="form-label">Select Employee</label>
                                <select
                                    className="form-select"
                                    value={formData.employeeId}
                                    onChange={function(e) { setFormData({...formData, employeeId: e.target.value}); }}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(function(emp) {
                                        return <option key={emp._id} value={emp._id}>{emp.name} - {emp.email}</option>;
                                    })}
                                </select>
                            </div>
                            
                            {/* Month Select */}
                            <div className="form-group">
                                <label className="form-label">Month</label>
                                <select
                                    className="form-select"
                                    value={formData.month}
                                    onChange={function(e) { setFormData({...formData, month: e.target.value}); }}
                                    required
                                >
                                    <option value="">Select Month</option>
                                    {monthsList.map(function(m) {
                                        return <option key={m.value} value={m.value}>{m.label}</option>;
                                    })}
                                </select>
                            </div>
                            
                            {/* Year Input */}
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={formData.year}
                                    onChange={function(e) { setFormData({...formData, year: e.target.value}); }}
                                    required
                                />
                            </div>
                            
                            {/* Salary Input */}
                            <div className="form-group">
                                <label className="form-label">Salary ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter salary"
                                    value={formData.salary}
                                    onChange={function(e) { setFormData({...formData, salary: e.target.value}); }}
                                    required
                                    min="0"
                                />
                            </div>
                            
                            {/* Deductions Input */}
                            <div className="form-group">
                                <label className="form-label">Deductions ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="0"
                                    value={formData.deductions}
                                    onChange={function(e) { setFormData({...formData, deductions: e.target.value}); }}
                                    min="0"
                                />
                            </div>
                            
                            {/* Bonuses Input */}
                            <div className="form-group">
                                <label className="form-label">Bonuses ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="0"
                                    value={formData.bonuses}
                                    onChange={function(e) { setFormData({...formData, bonuses: e.target.value}); }}
                                    min="0"
                                />
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary" style={{marginTop: "10px"}} disabled={submitting}>
                            {submitting ? "Generating..." : "Generate Payroll"}
                        </button>
                    </form>
                </div>
            )}

            {/* Payroll Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card">
                    <h3>Payroll Records ({payrolls.length})</h3>
                    
                    {payrolls.length === 0 ? (
                        <p>No payroll records found.</p>
                    ) : (
                        <table style={{width: "100%", borderCollapse: "collapse"}}>
                            <thead>
                                <tr style={{background: "#f8f9fa", textAlign: "left"}}>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Employee</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Month</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Year</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Salary</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Deductions</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Bonuses</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Net Salary</th>
                                    <th style={{padding: "10px", border: "1px solid #ddd"}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrolls.map(function(pay) {
                                    return (
                                        <tr key={pay._id}>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>{pay.employeeId?.name || "Unknown"}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>{getMonthName(pay.month)}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>{pay.year}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>${pay.salary}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>${pay.deductions || 0}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>${pay.bonuses || 0}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd", fontWeight: "bold"}}>${pay.netSalary}</td>
                                            <td style={{padding: "10px", border: "1px solid #ddd"}}>
                                                <button onClick={function() { handleEditClick(pay); }} className="btn btn-outline btn-sm">
                                                    Edit
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
            
            {/* Edit Modal */}
            {editId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Payroll</h3>
                        
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label className="form-label">Month</label>
                                <select
                                    className="form-select"
                                    value={editData.month}
                                    onChange={function(e) { setEditData({...editData, month: e.target.value}); }}
                                    required
                                >
                                    <option value="">Select Month</option>
                                    {monthsList.map(function(m) {
                                        return <option key={m.value} value={m.value}>{m.label}</option>;
                                    })}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editData.year}
                                    onChange={function(e) { setEditData({...editData, year: e.target.value}); }}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Salary ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editData.salary}
                                    onChange={function(e) { setEditData({...editData, salary: e.target.value}); }}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Deductions ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editData.deductions}
                                    onChange={function(e) { setEditData({...editData, deductions: e.target.value}); }}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Bonuses ($)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editData.bonuses}
                                    onChange={function(e) { setEditData({...editData, bonuses: e.target.value}); }}
                                />
                            </div>
                            
                            <button type="submit" className="btn btn-primary">Update</button>
                            <button type="button" onClick={handleEditCancel} className="btn btn-outline" style={{marginLeft: "10px"}}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Export this component to be used in other files
export default Payroll;
