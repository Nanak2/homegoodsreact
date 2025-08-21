// components/DashboardStats.jsx
import React from "react";

export default function DashboardStats() {
  // Placeholder values (fetch from backend later)
  const stats = {
    totalOrders: 45,
    totalRevenue: 12450.75,
    avgOrder: 276.68,
    pendingOrders: 5,
  };

  return (
    <div className="admin-stats" style={{ display: "flex", gap: "2rem" }}>
      <div className="stat-card">
        <h3>Total Orders</h3>
        <div>{stats.totalOrders}</div>
      </div>
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <div>GH₵{stats.totalRevenue.toFixed(2)}</div>
      </div>
      <div className="stat-card">
        <h3>Average Order</h3>
        <div>GH₵{stats.avgOrder.toFixed(2)}</div>
      </div>
      <div className="stat-card">
        <h3>Pending Orders</h3>
        <div>{stats.pendingOrders}</div>
      </div>
    </div>
  );
}
