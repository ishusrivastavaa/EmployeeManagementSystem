// =====================================================
// DASHBOARD PAGE - Simple and Easy to Understand
// =====================================================

// Import React hooks for managing state and side effects
import { useState, useEffect } from "react";

// Import navigation
import { Link, useNavigate } from "react-router-dom";

// =====================================================
// COMPONENT: Dashboard (Main Home Page)
// =====================================================
function Dashboard() {
    // ------------------------------------------
    // STEP 1: Define state variables
    // ------------------------------------------
    // user - stores the logged in user's information
    const [user, setUser] = useState(null);
    
    // navigate - used to redirect to other pages
    const navigate = useNavigate();

    // ------------------------------------------
    // STEP 2: Run when component loads
    // ------------------------------------------
    useEffect(function() {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        
        if (!token) {
            // No token - redirect to login
            navigate("/");
        } 
        else {
            // Get user data from storage
            const userData = localStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, [navigate]);

    // ------------------------------------------
    // STEP 3: Handle logout
    // ------------------------------------------
    const handleLogout = function() {
        // Clear stored data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to login page
        navigate("/");
    };

    // ------------------------------------------
    // STEP 4: Render the dashboard
    // ------------------------------------------
    return (
        <div className="page-container">
            
            {/* Header with user info and logout button */}
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p>Payroll Management System</p>
                </div>
                
                <div>
                    {/* Show user name and role */}
                    {user && (
                        <span>
                            Welcome, <strong>{user.name}</strong> ({user.role})
                        </span>
                    )}
                    
                    {/* Logout button */}
                    <button onClick={handleLogout} className="btn btn-danger" style={{marginLeft: "10px"}}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="welcome-section">
                <h2>Welcome back, {user?.name || 'User'}!</h2>
                <p>Here's what you can do:</p>
            </div>

            {/* ------------------------------------------
            STEP 5: Show different options based on user role
            ------------------------------------------ */}
            
            {/* If user is admin, show admin options */}
            {user?.role === "admin" && (
                <div className="quick-actions">
                    <h3>Admin Options</h3>
                    
                    <div className="action-grid">
                        {/* Link to Manage Employees */}
                        <Link to="/employees" className="action-card">
                            <h4>Manage Employees</h4>
                            <p>Add, view, or remove employees</p>
                        </Link>
                        
                        {/* Link to Generate Payroll */}
                        <Link to="/payroll" className="action-card">
                            <h4>Generate Payroll</h4>
                            <p>Create and manage payroll records</p>
                        </Link>
                        
                        {/* Link to View Payslips */}
                        <Link to="/payslips" className="action-card">
                            <h4>View Payslips</h4>
                            <p>View all employee payslips</p>
                        </Link>
                    </div>
                </div>
            )}

            {/* If user is employee, show employee options */}
            {user?.role === "employee" && (
                <div className="quick-actions">
                    <h3>Employee Options</h3>
                    
                    <div className="action-grid">
                        {/* Link to View Payslips */}
                        <Link to="/payslips" className="action-card">
                            <h4>My Payslips</h4>
                            <p>View your payslip history</p>
                        </Link>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="card" style={{marginTop: "20px"}}>
                <h3>Need Help?</h3>
                <p>Contact your administrator for any queries about payroll or employee management.</p>
            </div>

        </div>
    );
}

// Export this component to be used in other files
export default Dashboard;
