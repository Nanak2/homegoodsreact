// Admin.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardStats from "../../components/DashboardStats";

export default function Admin() {
  // Example states (you can connect these to API calls later)
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // Example handler placeholders
  const refreshProducts = () => {
    console.log("Refreshing products...");
    // fetch products here → update setProductCount
  };

  const loadAdminData = () => {
    console.log("Loading admin data...");
    // fetch orders here → update orderCount, stats, etc.
  };

  const clearAllLocalData = () => {
    console.log("Clearing local data...");
    localStorage.clear();
  };

  return (
    <div id="adminPage" className="">
      {/* Header */}
      <div
        style={{
          display: "inline",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          Admin Dashboard
        </h2>
        {/* Overview Section */}
        <DashboardStats />
      </div>

      {/* Management sections */}
      <div className="management-links" style={{ display: "flex", gap: "1rem" }}>
        <Link to="/admin/orders">📋 Manage Orders</Link>
        <Link to="/admin/products">📦 Manage Products</Link>
        <Link to="/admin/customers">👥 Manage Customers</Link>
        <Link to="/admin/reports">📊 Reports</Link>
      </div>
    </div>
  );
}
