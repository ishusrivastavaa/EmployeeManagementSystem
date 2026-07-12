import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async function (e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/auth/register", {
        name: name,
        email: email,
        password: password,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error.map((e) => e.msg).join(", ");
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header Section */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "1.75rem", height: "1.75rem" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235A8.902 8.902 0 0 1 9 18a8.902 8.902 0 0 1 6 1.235c0 .373-.207.728-.53 1.004l-.233.197H3.763l-.233-.197A1.396 1.396 0 0 1 3 19.235Z" />
            </svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Get started with the Payroll System</p>
        </div>

        {/* Success / Error Alerts */}
        {error && (
          <div 
            style={{
              backgroundColor: "var(--danger-light)",
              color: "var(--danger)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              fontWeight: "500",
              textAlign: "left"
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
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              fontWeight: "500",
              textAlign: "left"
            }}
          >
            {success}
          </div>
        )}

        {/* Registration Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="john.doe@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "0.5rem", width: "100%" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px", borderTopColor: "white", marginRight: "6px" }}></div>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer - Link to Login */}
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/" style={{ fontWeight: "600" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
