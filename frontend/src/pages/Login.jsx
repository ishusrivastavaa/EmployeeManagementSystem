// =====================================================
// LOGIN PAGE - Simple and Easy to Understand
// =====================================================

// Import React hooks for managing state
import { useState } from "react";

// Import navigation and API services
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

// =====================================================
// COMPONENT: Login Form
// =====================================================
function Login() {
    // ------------------------------------------
    // STEP 1: Define state variables
    // ------------------------------------------
    // email - stores the email user types
    const [email, setEmail] = useState("");
    
    // password - stores the password user types
    const [password, setPassword] = useState("");
    
    // loading - shows if form is being submitted
    const [loading, setLoading] = useState(false);
    
    // navigate - used to redirect to other pages
    const navigate = useNavigate();

    // ------------------------------------------
    // STEP 2: Handle form submission
    // ------------------------------------------
    const handleSubmit = async function(e) {
        // Prevent default form behavior (page refresh)
        e.preventDefault();
        
        // Set loading to true while processing
        setLoading(true);

        try {
            // Send login request to backend
            const response = await API.post("/auth/login", {
                email: email,
                password: password
            });

            // Save the token (for authentication)
            localStorage.setItem("token", response.data.token);
            
            // Save user info
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Redirect to dashboard
            navigate("/dashboard");
        } 
        catch (error) {
            // Handle errors - show user-friendly message
            let errorMessage = "Login failed. Please try again.";
            
            // Check if we have validation errors from server
            if (error.response && error.response.data) {
                if (error.response.data.error) {
                    // Get all validation error messages
                    errorMessage = error.response.data.error.map(err => err.msg).join(", ");
                } 
                else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
            
            // Show error to user
            alert(errorMessage);
        }
        finally {
            // Set loading back to false
            setLoading(false);
        }
    };

    // ------------------------------------------
    // STEP 3: Render the login form
    // ------------------------------------------
    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header Section */}
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to Payroll System</p>
                </div>

                {/* Login Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    
                    {/* Email Input */}
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={function(e) { setEmail(e.target.value); }}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={function(e) { setPassword(e.target.value); }}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Footer - Link to Register */}
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create Account</Link></p>
                </div>
            </div>
        </div>
    );
}

// Export this component to be used in other files
export default Login;
