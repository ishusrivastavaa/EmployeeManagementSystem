// =====================================================
// REGISTER PAGE - Simple and Easy to Understand
// =====================================================

// Import React hooks for managing state
import { useState } from "react";

// Import navigation and API services
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

// =====================================================
// COMPONENT: Registration Form
// =====================================================
function Register() {
    // ------------------------------------------
    // STEP 1: Define state variables
    // ------------------------------------------
    // name - stores the user's full name
    const [name, setName] = useState("");
    
    // email - stores the user's email address
    const [email, setEmail] = useState("");
    
    // password - stores the user's password
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
            // Send registration request to backend
            await API.post("/auth/register", {
                name: name,
                email: email,
                password: password
            });

            // Show success message
            alert("Registration successful! Please login.");
            
            // Redirect to login page
            navigate("/");
        } 
        catch (error) {
            // Handle errors - show user-friendly message
            let errorMessage = "Registration failed. Please try again.";
            
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
    // STEP 3: Render the registration form
    // ------------------------------------------
    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header Section */}
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join the Payroll System</p>
                </div>

                {/* Registration Form */}
                <form className="auth-form" onSubmit={handleSubmit}>
                    
                    {/* Name Input */}
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={function(e) { setName(e.target.value); }}
                            required
                        />
                    </div>

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
                            placeholder="Create a password (min 6 characters)"
                            value={password}
                            onChange={function(e) { setPassword(e.target.value); }}
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                {/* Footer - Link to Login */}
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}

// Export this component to be used in other files
export default Register;
