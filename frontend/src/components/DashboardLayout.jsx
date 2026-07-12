import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  DashboardIcon,
  EmployeesIcon,
  PayrollIcon,
  PayslipsIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
  UserIcon
} from "./Icons";

function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auth Guard check
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      // Redirect to login page if unauthenticated
      navigate("/");
    } else {
      try {
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Close sidebar on page change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  if (!user) {
    return (
      <div className="loading-container" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
        <p>Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "1.5rem", height: "1.5rem" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M5.25 7.5h13.5m-12 9h10.5M8.25 13.5h7.5" />
            </svg>
          </div>
          <span className="sidebar-brand-name">EMS Payroll</span>
          
          {/* Close button for mobile menu drawer */}
          <button 
            className="menu-toggle-btn" 
            style={{ marginLeft: "auto", display: "none", color: "white" }} 
            onClick={() => setMobileOpen(false)}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation Menu */}
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard" className={`sidebar-item-link ${isActive("/dashboard")}`}>
              <DashboardIcon />
              <span>Dashboard</span>
            </Link>
          </li>
          
          {user.role === "admin" && (
            <>
              <li>
                <Link to="/employees" className={`sidebar-item-link ${isActive("/employees")}`}>
                  <EmployeesIcon />
                  <span>Employees</span>
                </Link>
              </li>
              <li>
                <Link to="/payroll" className={`sidebar-item-link ${isActive("/payroll")}`}>
                  <PayrollIcon />
                  <span>Payroll</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/payslips" className={`sidebar-item-link ${isActive("/payslips")}`}>
              <PayslipsIcon />
              <span>{user.role === "admin" ? "All Payslips" : "My Payslips"}</span>
            </Link>
          </li>
        </ul>

        {/* Sidebar Footer User Widget */}
        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="profile-avatar">
              {getInitials(user.name)}
            </div>
            <div className="profile-info">
              <div className="profile-name">{user.name}</div>
              <div className="profile-role">
                <span className={`badge ${user.role === "admin" ? "badge-admin" : "badge-employee"}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-sidebar-logout" type="button">
            <LogoutIcon style={{ width: "16px", height: "16px" }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="main-wrapper">
        {/* Mobile Topbar header */}
        <header className="mobile-topbar">
          <button 
            className="menu-toggle-btn" 
            onClick={() => setMobileOpen(true)}
            type="button"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          
          <span className="sidebar-brand-name" style={{ color: "var(--text-primary)" }}>EMS Payroll</span>
          
          <div 
            className="profile-avatar" 
            style={{ width: "32px", height: "32px", fontSize: "0.75rem" }}
          >
            {getInitials(user.name)}
          </div>
        </header>

        {/* Overlay backdrop when sidebar is open in mobile drawer mode */}
        {mobileOpen && (
          <div 
            className="modal-overlay" 
            style={{ zIndex: 99, background: "rgba(15, 23, 42, 0.3)" }} 
            onClick={() => setMobileOpen(false)}
          ></div>
        )}

        {/* Page content injection site */}
        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
