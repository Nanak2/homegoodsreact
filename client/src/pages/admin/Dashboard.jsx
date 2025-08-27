// client/src/pages/admin/Dashboard.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BsCart,        // ShoppingCart
  BsCurrencyDollar, // DollarSign
  BsGraphUp,     // TrendingUp
  BsClock,       // Clock
  BsPeople,      // People
  BsBox,         // Box
  BsBarChart,    // BarChart
  BsTags,        // Tags
  BsGear,        // Gear
} from "react-icons/bs";

const data = [
  { name: "Jan", sales: 50 },
  { name: "Feb", sales: 70 },
  { name: "Mar", sales: 200 },
  { name: "Apr", sales: 180 },
  { name: "May", sales: 240 },
  { name: "Jun", sales: 320 },
  { name: "Jul", sales: 280 },
];

const Dashboard = () => {
  const location = useLocation();

  // Define navigation items with proper routes
  const navigationItems = [
    { icon: <BsCart />, label: "Orders", path: "/admin/orders" },
    { icon: <BsBox />, label: "Products", path: "/admin/products" },
    { icon: <BsPeople />, label: "Customers", path: "/admin/customers" },
    { icon: <BsBarChart />, label: "Reports", path: "/admin/reports" },
    { icon: <BsTags />, label: "Discounts", path: "/admin/discounts" },
    { icon: <BsGear />, label: "Settings", path: "/admin/settings" }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row">

        {/* Main Content */}
        <div className="">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold">Dashboard</h1>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Search"
                className="form-control"
                style={{ maxWidth: "200px" }}
              />
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: "40px", height: "40px" }}
              >
                <BsPeople />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-5">
            {/* Total Orders */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-primary bg-opacity-10 rounded">
                    <BsCart className="text-primary" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Total Orders</p>
                    <h5 className="mb-0">248</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-success bg-opacity-10 rounded">
                    <BsCurrencyDollar className="text-success" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Total Revenue</p>
                    <h5 className="mb-0">GH₵45,820</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-info bg-opacity-10 rounded">
                    <BsGraphUp className="text-info" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Growth</p>
                    <h5 className="mb-0">+12.5%</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-warning bg-opacity-10 rounded">
                    <BsClock className="text-warning" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Pending Orders</p>
                    <h5 className="mb-0">12</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmed Orders */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-success bg-opacity-10 rounded">
                    <BsClock className="text-success" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Confirmed Orders</p>
                    <h5 className="mb-0">30</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar + Sales */}
          <div className="row" style={{ marginTop: '-45px'}}>
            {/* Navigation Sidebar */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="bg-white p-3 border rounded shadow-sm h-100">
                <h5 className="mb-4">Manage</h5>
                <ul className="list-unstyled">
                  {navigationItems.map((item, idx) => (
                    <li key={idx} className="mb-3">
                      <Link
                        to={item.path}
                        className={`d-flex align-items-center text-decoration-none sidebar-link ${
                          location.pathname === item.path ? 'active' : ''
                        }`}
                        style={{ 
                          cursor: "pointer",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          transition: "all 0.2s ease-in-out"
                        }}
                      >
                        <span className="me-3">{item.icon}</span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sales Overview */}
            <div className="mb-3" style={{ maxWidth: "40%" }}>
              <div className="card shadow-sm p-4 h-100">
                <h5 className="mb-4">Sales Overview</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#0d6efd"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="mb-3" style={{ maxWidth: "40%" }}>
              <div className="card shadow-sm p-4 h-100">
                <h5 className="mb-4">Revenue by Category</h5>
                <div className="space-y-3">
                  {[
                    { category: "Kitchen & Dining", revenue: 12450, color: "#0d6efd", percentage: 35 },
                    { category: "Home & Living", revenue: 8920, color: "#198754", percentage: 25 },
                    { category: "Electronics", revenue: 6780, color: "#ffc107", percentage: 19 },
                    { category: "Garden & Outdoor", revenue: 4230, color: "#dc3545", percentage: 12 },
                    { category: "Personal Care", revenue: 3140, color: "#6f42c1", percentage: 9 }
                  ].map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold small">{item.category}</span>
                        <span className="small text-muted">GH₵{item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="progress" style={{ height: "8px" }}>
                        <div
                          className="progress-bar"
                          style={{ 
                            width: `${item.percentage}%`, 
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hover styles for sidebar */}
      <style>
        {`
          .sidebar-link {
            color: #6c757d !important;
          }
          
          .sidebar-link:hover {
            color: #0d6efd !important;
            background-color: #f8f9fa !important;
            font-weight: 500 !important;
            transform: translateX(4px);
          }
          
          .sidebar-link.active {
            color: #0d6efd !important;
            background-color: #e7f1ff !important;
            font-weight: 600 !important;
          }
          
          .sidebar-link.active:hover {
            transform: none;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;