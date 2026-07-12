import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  ChevronLeftIcon,
  PrintIcon,
  SearchIcon,
  PayslipsIcon,
  DollarIcon
} from "../components/Icons";

const monthsList = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Payslips() {
  const [payslips, setPayslips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [printPayslipId, setPrintPayslipId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/");
    } else {
      const parsedUser = userData ? JSON.parse(userData) : null;
      setUser(parsedUser);
      fetchPayslips(parsedUser);
    }
  }, [navigate]);

  const fetchPayslips = async (currentUser) => {
    try {
      if (currentUser && currentUser.role === "admin") {
        const response = await API.get("/payslips");
        setPayslips(response.data);
      } else {
        const response = await API.get("/payslips/my");
        setPayslips(response.data);
      }
    } catch (err) {
      console.error("Error fetching payslip histories:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthValue) => {
    return monthsList[parseInt(monthValue)] || monthValue;
  };

  const formatCurrency = (amount) => {
    return "$" + Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Triggers the window print dialog
  const handlePrint = (payslipId) => {
    setPrintPayslipId(payslipId);
  };

  // Triggers printing once the state is set and target class is updated in DOM
  useEffect(() => {
    if (printPayslipId !== null) {
      // Small timeout to allow styling update to apply in DOM
      const timer = setTimeout(() => {
        window.print();
        setPrintPayslipId(null);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [printPayslipId]);

  // Filter payslips by employee name (for admin) or month/year (for employee)
  const filteredPayslips = payslips.filter((payslip) => {
    const query = searchQuery.toLowerCase();
    const empName = payslip.employeeId?.name || "";
    const month = getMonthName(payslip.month);
    const year = payslip.year.toString();
    
    return (
      empName.toLowerCase().includes(query) ||
      month.toLowerCase().includes(query) ||
      year.includes(query)
    );
  });

  return (
    <div>
      {/* Page Header */}
      <div 
        className="print-hide"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.75rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border-color)"
        }}
      >
        <div>
          <Link to="/dashboard" className="back-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.25rem" }}>
            <ChevronLeftIcon style={{ width: "16px", height: "16px" }} />
            <span>Dashboard</span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>
            {user?.role === "admin" ? "Employee Payslips Archive" : "My Pay Statements"}
          </h1>
        </div>

        <div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: "500" }}>Account Profile: </span>
          <span className={`badge ${user?.role === "admin" ? "badge-admin" : "badge-employee"}`}>
            {user?.name} ({user?.role})
          </span>
        </div>
      </div>

      {/* Control panel: search bar & stats summary */}
      <div className="search-control-container print-hide">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            className="form-input"
            placeholder={user?.role === "admin" ? "Search by employee name, month or year..." : "Search statements by month or year..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500", whiteSpace: "nowrap" }}>
          Found <strong>{filteredPayslips.length}</strong> payroll receipts
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Retrieving pay slips...</p>
        </div>
      ) : filteredPayslips.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <PayslipsIcon style={{ width: "2rem", height: "2rem" }} />
            </div>
            <h4>No Payslip Statements Found</h4>
            <p>
              {user?.role === "admin"
                ? "No payroll records exist matching the search criteria or database history. Visit the Payroll tab to generate statements."
                : "Your monthly payslips will be loaded here once generated by the database administrator."}
            </p>
            {user?.role === "admin" ? (
              <Link to="/payroll" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                Generate First Payroll
              </Link>
            ) : (
              searchQuery && (
                <button onClick={() => setSearchQuery("")} className="btn btn-outline btn-sm">
                  Reset Filter
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="payslip-grid">
          {filteredPayslips.map((payslip) => {
            const isPrintingThis = printPayslipId === payslip._id;
            return (
              <div 
                key={payslip._id} 
                className={`payslip-card ${isPrintingThis ? "payslip-card-to-print" : ""}`}
              >
                {/* Invoice Header */}
                <div className="payslip-header">
                  <h4>{getMonthName(payslip.month)} {payslip.year}</h4>
                  <div className="payslip-id">Receipt #{payslip._id.substring(payslip._id.length - 8).toUpperCase()}</div>
                </div>

                {/* Invoice Body */}
                <div className="payslip-body">
                  <div className="payslip-employee-details">
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.05em" }}>Employee</div>
                    <div className="payslip-emp-name">{payslip.employeeId?.name || "Unknown Staff"}</div>
                    <div className="payslip-emp-email">{payslip.employeeId?.email || "N/A"}</div>
                    {payslip.employeeId?.designation && (
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.125rem" }}>
                        {payslip.employeeId.designation} {payslip.employeeId.department ? `(${payslip.employeeId.department})` : ""}
                      </div>
                    )}
                  </div>

                  <div className="payslip-divider"></div>

                  <div className="payslip-row">
                    <span>Base Monthly Salary</span>
                    <span className="td-bold">{formatCurrency(payslip.salary)}</span>
                  </div>

                  <div className="payslip-row" style={{ color: "var(--success)" }}>
                    <span>Bonuses & Perks</span>
                    <span>+{formatCurrency(payslip.bonuses || 0)}</span>
                  </div>

                  <div className="payslip-row" style={{ color: "var(--danger)" }}>
                    <span>Tax & Deductions</span>
                    <span>-{formatCurrency(payslip.deductions || 0)}</span>
                  </div>

                  <div className="payslip-row total">
                    <span>Net Monthly Take-home</span>
                    <span>{formatCurrency(payslip.netSalary)}</span>
                  </div>
                </div>

                {/* Print Action Row */}
                <div className="payslip-actions">
                  <button
                    onClick={() => handlePrint(payslip._id)}
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%" }}
                    type="button"
                  >
                    <PrintIcon style={{ width: "14px", height: "14px" }} />
                    <span>Print / PDF Export</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Payslips;
