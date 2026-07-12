import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  EmployeesIcon,
  PayrollIcon,
  PayslipsIcon,
  DollarIcon,
  InfoIcon
} from "../components/Icons";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    employeesCount: 0,
    payrollCount: 0,
    payslipsCount: 0,
    totalOutflow: 0,
    totalEarned: 0,
    latestSalary: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchDashboardStats(parsedUser);
    }
  }, []);

  const fetchDashboardStats = async (currentUser) => {
    try {
      if (currentUser.role === "admin") {
        const [empRes, payRes, slipRes] = await Promise.all([
          API.get("/employees"),
          API.get("/payroll"),
          API.get("/payslips"),
        ]);
        
        const outflow = payRes.data.reduce((sum, p) => sum + (p.netSalary || 0), 0);
        
        setStats({
          employeesCount: empRes.data.length,
          payrollCount: payRes.data.length,
          payslipsCount: slipRes.data.length,
          totalOutflow: outflow,
        });
      } else {
        const slipRes = await API.get("/payslips/my");
        const slips = slipRes.data;
        const total = slips.reduce((sum, s) => sum + (s.netSalary || 0), 0);
        const latest = slips.length > 0 ? slips[0].netSalary : 0;
        
        setStats({
          payslipsCount: slips.length,
          totalEarned: total,
          latestSalary: latest,
        });
      }
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return "$" + Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-hero-card">
        <h2>Welcome back, {user?.name || "User"}!</h2>
        <p>
          {user?.role === "admin"
            ? "Here is a quick overview of your employee directory and payroll operations. Use the sidebar to make updates."
            : "Review your monthly salary receipts and download printable payslips from your dashboard."}
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Gathering metrics...</p>
        </div>
      ) : (
        <div className="stats-grid">
          {user?.role === "admin" ? (
            <>
              {/* Stat 1: Total Employees */}
              <div className="stat-card">
                <div className="stat-icon employees">
                  <EmployeesIcon />
                </div>
                <div className="stat-info">
                  <h4>Total Employees</h4>
                  <div className="stat-value">{stats.employeesCount}</div>
                </div>
              </div>

              {/* Stat 2: Payroll Generated */}
              <div className="stat-card">
                <div className="stat-icon payroll">
                  <PayrollIcon />
                </div>
                <div className="stat-info">
                  <h4>Payroll Processes</h4>
                  <div className="stat-value">{stats.payrollCount}</div>
                </div>
              </div>

              {/* Stat 3: Total Expenses Outflow */}
              <div className="stat-card">
                <div className="stat-icon payslips">
                  <DollarIcon />
                </div>
                <div className="stat-info">
                  <h4>Expenses Outflow</h4>
                  <div className="stat-value">{formatCurrency(stats.totalOutflow)}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Stat 1: My Payslips */}
              <div className="stat-card">
                <div className="stat-icon payslips">
                  <PayslipsIcon />
                </div>
                <div className="stat-info">
                  <h4>My Payslips</h4>
                  <div className="stat-value">{stats.payslipsCount}</div>
                </div>
              </div>

              {/* Stat 2: Latest Salary */}
              <div className="stat-card">
                <div className="stat-icon employees">
                  <DollarIcon />
                </div>
                <div className="stat-info">
                  <h4>Latest Net Pay</h4>
                  <div className="stat-value">{formatCurrency(stats.latestSalary)}</div>
                </div>
              </div>

              {/* Stat 3: Total Earnings */}
              <div className="stat-card">
                <div className="stat-icon payroll">
                  <DollarIcon />
                </div>
                <div className="stat-info">
                  <h4>Total Earned</h4>
                  <div className="stat-value">{formatCurrency(stats.totalEarned)}</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="quick-actions">
        <h3>Quick Operations</h3>
        <div className="action-grid">
          {user?.role === "admin" ? (
            <>
              <Link to="/employees" className="action-card">
                <EmployeesIcon />
                <h4>Manage Employees</h4>
                <p>Register new staff members, edit roles, or remove profiles from the system directory.</p>
              </Link>

              <Link to="/payroll" className="action-card">
                <PayrollIcon />
                <h4>Generate Payroll</h4>
                <p>Calculate base wages, assign bonuses, deduct expenses, and create monthly salaries.</p>
              </Link>

              <Link to="/payslips" className="action-card">
                <PayslipsIcon />
                <h4>View Payslips</h4>
                <p>Audit and search through all generated pay slips. Print or download records.</p>
              </Link>
            </>
          ) : (
            <Link to="/payslips" className="action-card">
              <PayslipsIcon />
              <h4>My Payslips</h4>
              <p>Browse through your complete historical salary statements and export them to PDF.</p>
            </Link>
          )}
        </div>
      </div>

      {/* Help Banner Section */}
      <div className="card" style={{ marginTop: "2rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div 
          style={{
            background: "var(--primary-light)",
            color: "var(--primary-color)",
            padding: "0.5rem",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <InfoIcon />
        </div>
        <div>
          <h4 style={{ marginBottom: "0.25rem" }}>Need Assistance?</h4>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            For queries about your base salary, bonuses, tax deductions, or updating profile details, please get in touch with the human resources department or your workspace administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
