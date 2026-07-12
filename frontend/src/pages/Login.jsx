import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async function (e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 7.5h13.5m-12 9h10.5M8.25 13.5h7.5" />
            </svg>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Payroll Dashboard</p>
        </div>

        {/* Error Alert Panel */}
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

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: "0.8125rem", color: "var(--primary-color)", fontWeight: "500" }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer - Link to Register */}
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register" style={{ fontWeight: "600" }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
