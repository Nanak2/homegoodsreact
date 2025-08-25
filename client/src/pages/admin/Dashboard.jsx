// Dashboard.jsx
import React from "react";
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
                    <h5 className="mb-0">1,250</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100 border-start border-success border-3">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-success bg-opacity-10 rounded">
                    <BsCurrencyDollar className="text-success" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Total Revenue</p>
                    <h5 className="mb-0">$34,567</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Average Order */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3 p-3 bg-info bg-opacity-10 rounded">
                    <BsGraphUp className="text-info" />
                  </div>
                  <div>
                    <p className="mb-1 text-muted">Average Order</p>
                    <h5 className="mb-0">$82</h5>
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
                    <h5 className="mb-0">57</h5>
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
                    <p className="mb-1 text-muted">Confirmed Orders</p>
                    <h5 className="mb-0">30</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar + Sales */}
          <div className="row" style={{ marginTop: '-45px'}}>
            {/* Sidebar */}
            <div className="mb-3" style={{ maxWidth: "20%" }}>
              <div className="bg-white p-3 border rounded shadow-sm h-100">
                <h5 className="mb-4">Manage</h5>
                <ul className="list-unstyled">
                  {[
                    { icon: <BsCart />, label: "Orders" },
                    { icon: <BsBox />, label: "Products" },
                    { icon: <BsPeople />, label: "Customers" },
                    { icon: <BsBarChart />, label: "Reports" },
                    { icon: <BsTags />, label: "Discounts" },
                    { icon: <BsGear />, label: "Settings" }
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="mb-3 d-flex align-items-center sidebar-item"
                      style={{ cursor: "pointer" }}
                    >
                      <span className="me-2">{item.icon}</span>
                      {item.label}
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
          </div>
        </div>
      </div>

      {/* Hover styles for sidebar */}
      <style>
        {`
          .sidebar-item:hover {
            color: #0d6efd;
            font-weight: 500;
            transform: translateX(4px);
            transition: all 0.2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
