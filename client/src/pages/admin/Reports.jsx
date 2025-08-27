// client/src/pages/admin/Reports.jsx
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BsCalendar,
  BsDownload,
  BsArrowUpRight,
  BsArrowDownRight,
  BsCurrencyDollar,
  BsCart,
  BsPeople,
  BsBoxSeam,
  BsGraphUp,
  BsGraphDown,
  BsEye,
  BsFilter,
  BsFileEarmarkText,
  BsPrinter,
  BsShare,
} from "react-icons/bs";

export default function Reports() {
  // State management
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Mock data for charts
  const salesData = [
    { date: "2025-01-01", sales: 4200, orders: 15, customers: 12 },
    { date: "2025-01-02", sales: 3800, orders: 12, customers: 10 },
    { date: "2025-01-03", sales: 5100, orders: 18, customers: 16 },
    { date: "2025-01-04", sales: 4600, orders: 16, customers: 14 },
    { date: "2025-01-05", sales: 3900, orders: 13, customers: 11 },
    { date: "2025-01-06", sales: 6200, orders: 22, customers: 19 },
    { date: "2025-01-07", sales: 5800, orders: 20, customers: 17 },
    { date: "2025-01-08", sales: 4400, orders: 15, customers: 13 },
    { date: "2025-01-09", sales: 4900, orders: 17, customers: 15 },
    { date: "2025-01-10", sales: 5600, orders: 19, customers: 16 },
    { date: "2025-01-11", sales: 4100, orders: 14, customers: 12 },
    { date: "2025-01-12", sales: 5300, orders: 18, customers: 16 },
    { date: "2025-01-13", sales: 4700, orders: 16, customers: 14 },
    { date: "2025-01-14", sales: 6100, orders: 21, customers: 18 },
  ];

  const categoryData = [
    { name: "Kitchen & Dining", sales: 18500, percentage: 35, color: "#0d6efd" },
    { name: "Home & Living", sales: 12300, percentage: 23, color: "#198754" },
    { name: "Electronics", sales: 9800, percentage: 18, color: "#ffc107" },
    { name: "Garden & Outdoor", sales: 7200, percentage: 14, color: "#dc3545" },
    { name: "Personal Care", sales: 5200, percentage: 10, color: "#6f42c1" },
  ];

  const topProducts = [
    { name: "Premium Ceramic Dinner Set", sales: 3200, units: 24, growth: 15.2 },
    { name: "Luxury Bath Towel Set", sales: 2800, units: 35, growth: 8.7 },
    { name: "Smart LED Table Lamp", sales: 2400, units: 48, growth: -3.1 },
    { name: "Professional Kitchen Knives", sales: 2100, units: 15, growth: 22.4 },
    { name: "Outdoor Garden Planters", sales: 1900, units: 21, growth: 12.8 },
  ];

  const customerMetrics = [
    { metric: "New Customers", value: 156, change: 12.5, period: "vs last month" },
    { metric: "Returning Customers", value: 89, change: -2.3, period: "vs last month" },
    { metric: "Average Order Value", value: 127.50, change: 8.9, period: "vs last month" },
    { metric: "Customer Lifetime Value", value: 284.20, change: 15.7, period: "vs last month" },
  ];

  const monthlyComparison = [
    { month: "Sep", current: 28500, previous: 24200 },
    { month: "Oct", current: 32100, previous: 28500 },
    { month: "Nov", current: 35800, previous: 32100 },
    { month: "Dec", current: 42300, previous: 35800 },
    { month: "Jan", current: 38900, previous: 42300 },
  ];

  // Calculate summary stats
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalSales / totalOrders;
  const salesGrowth = 12.8; // Mock growth percentage

  const formatCurrency = (value) => `GH₵${value.toLocaleString()}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadReport = (format) => {
    console.log(`Downloading report in ${format} format`);
    // TODO: Implement actual report download
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">Reports & Analytics</h1>
          <p className="text-muted mb-0">Business insights and performance metrics</p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button className="btn btn-outline-secondary">
            <BsPrinter className="me-1" />
            Print
          </button>
          <button className="btn btn-outline-secondary">
            <BsShare className="me-1" />
            Share
          </button>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
              <BsDownload className="me-1" />
              Export
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => downloadReport('pdf')}>PDF Report</button></li>
              <li><button className="dropdown-item" onClick={() => downloadReport('excel')}>Excel Spreadsheet</button></li>
              <li><button className="dropdown-item" onClick={() => downloadReport('csv')}>CSV Data</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-success bg-opacity-10 rounded">
                  <BsCurrencyDollar className="text-success" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Revenue</p>
                  <h4 className="mb-0">{formatCurrency(totalSales)}</h4>
                  <small className="text-success d-flex align-items-center">
                    <BsArrowUpRight className="me-1" />
                    +{salesGrowth}% vs last period
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-primary bg-opacity-10 rounded">
                  <BsCart className="text-primary" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Orders</p>
                  <h4 className="mb-0">{totalOrders}</h4>
                  <small className="text-success d-flex align-items-center">
                    <BsArrowUpRight className="me-1" />
                    +8.5% vs last period
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-info bg-opacity-10 rounded">
                  <BsPeople className="text-info" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Avg Order Value</p>
                  <h4 className="mb-0">{formatCurrency(averageOrderValue)}</h4>
                  <small className="text-warning d-flex align-items-center">
                    <BsArrowDownRight className="me-1" />
                    -2.1% vs last period
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-warning bg-opacity-10 rounded">
                  <BsGraphUp className="text-warning" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Growth Rate</p>
                  <h4 className="mb-0">+{salesGrowth}%</h4>
                  <small className="text-success d-flex align-items-center">
                    <BsArrowUpRight className="me-1" />
                    Trending up
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sales Trend Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Sales Performance</h5>
                <div className="btn-group btn-group-sm" role="group">
                  <button className="btn btn-outline-secondary active">Revenue</button>
                  <button className="btn btn-outline-secondary">Orders</button>
                  <button className="btn btn-outline-secondary">Customers</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#0d6efd" 
                    fill="#0d6efd"
                    fillOpacity={0.1}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0 fw-semibold">Sales by Category</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="sales"
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3">
                {categoryData.map((category, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded me-2" 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: category.color 
                        }}
                      ></div>
                      <span className="small text-muted">{category.name}</span>
                    </div>
                    <span className="small fw-semibold">{formatCurrency(category.sales)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Monthly Comparison */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0 fw-semibold">Monthly Comparison</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="current" fill="#0d6efd" name="Current Year" />
                  <Bar dataKey="previous" fill="#adb5bd" name="Previous Year" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0 fw-semibold">Customer Insights</h5>
            </div>
            <div className="card-body">
              {customerMetrics.map((metric, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded">
                  <div>
                    <div className="fw-semibold">{metric.metric}</div>
                    <small className="text-muted">{metric.period}</small>
                  </div>
                  <div className="text-end">
                    <div className="h5 mb-0">
                      {metric.metric.includes('Value') || metric.metric.includes('Lifetime') 
                        ? formatCurrency(metric.value) 
                        : metric.value.toLocaleString()}
                    </div>
                    <small className={`d-flex align-items-center justify-content-end ${metric.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {metric.change >= 0 ? <BsArrowUpRight className="me-1" /> : <BsArrowDownRight className="me-1" />}
                      {Math.abs(metric.change)}%
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">Top Performing Products</h5>
            <button className="btn btn-outline-primary btn-sm">
              <BsEye className="me-1" />
              View All Products
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Revenue</th>
                <th>Units Sold</th>
                <th>Growth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">#{index + 1}</span>
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold">{product.name}</div>
                  </td>
                  <td className="fw-semibold">{formatCurrency(product.sales)}</td>
                  <td>{product.units} units</td>
                  <td>
                    <span className={`d-flex align-items-center ${product.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                      {product.growth >= 0 ? <BsArrowUpRight className="me-1" /> : <BsArrowDownRight className="me-1" />}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm">
                      <BsEye className="me-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Generation */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0 fw-semibold">Generate Custom Reports</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Report Type</label>
              <select 
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview">Business Overview</option>
                <option value="sales">Sales Report</option>
                <option value="products">Product Performance</option>
                <option value="customers">Customer Analysis</option>
                <option value="inventory">Inventory Report</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control" defaultValue="2025-01-01" />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input type="date" className="form-control" defaultValue="2025-01-31" />
            </div>
            <div className="col-md-3">
              <label className="form-label">&nbsp;</label>
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-fill">
                  <BsFileEarmarkText className="me-1" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}