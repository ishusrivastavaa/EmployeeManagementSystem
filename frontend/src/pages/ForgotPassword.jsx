import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/forgot-password", { email });
      setSuccess(response.data.message || "OTP generated and sent successfully!");
      setOtpSent(true);
    } catch (err) {
      let errorMessage = "Failed to request password reset.";
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/reset-password-otp", {
        email,
        otp,
        password
      });
      
      setSuccess("Password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      let errorMessage = "Failed to reset password. Please check your OTP code.";
      if (err.response && err.response.data) {
        if (err.response.data.message) {
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
      <div className="auth-card" style={{ maxWidth: "440px" }}>
        {/* Header Section */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "1.75rem", height: "1.75rem" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818l6.002-6.002a1.125 1.125 0 0 0 .43-1.563 6 6 0 1 1 7.029-5.912Z" />
            </svg>
          </div>
          <h1 className="auth-title">
            {!otpSent ? "Forgot Password" : "Verify OTP Code"}
          </h1>
          <p className="auth-subtitle">
            {!otpSent 
              ? "Enter your email address to receive a 6-digit verification code."
              : "We have sent a verification code to your email. Enter it below to set your new password."}
          </p>
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

        {/* Success Alert Panel */}
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

        {/* 2-Step Form Wizard */}
        {!otpSent ? (
          /* STEP 1: REQUEST OTP */
          <form className="auth-form" onSubmit={handleRequestOTP}>
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "0.5rem", width: "100%" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px", borderTopColor: "white", marginRight: "6px" }}></div>
                  Sending OTP...
                </>
              ) : (
                "Send OTP Verification Code"
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: VERIFY OTP & RESET PASSWORD */
          <form className="auth-form" onSubmit={handleResetPassword}>
            {/* Prefilled Email (Read-Only) */}
            <div className="form-group">
              <label className="form-label">Confirming Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                disabled
                style={{ backgroundColor: "var(--border-color)", cursor: "not-allowed", opacity: 0.8 }}
              />
            </div>

            {/* OTP Input */}
            <div className="form-group">
              <label className="form-label">6-Digit OTP Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="E.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").substring(0, 6))}
                required
                maxLength={6}
                pattern="\d{6}"
                style={{ letterSpacing: "0.15em", fontSize: "1.1rem", fontWeight: "600", textAlign: "center" }}
              />
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label">New Password</label>
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

            {/* Confirm Password Input */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => {
                  setOtpSent(false);
                  setSuccess("");
                  setError("");
                }}
                disabled={loading}
              >
                Go Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px", borderTopColor: "white", marginRight: "6px" }}></div>
                    Verifying...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer - Link to Login */}
        <div className="auth-footer">
          <p>
            Remembered your password? <Link to="/" style={{ fontWeight: "600" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
