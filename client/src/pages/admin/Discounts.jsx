// client/src/pages/admin/Discounts.jsx
import React, { useState, useEffect } from "react";
import {
  BsPlus,
  BsSearch,
  BsFilter,
  BsDownload,
  BsEye,
  BsThreeDotsVertical,
  BsArrowClockwise,
  BsPencilSquare,
  BsTrash,
  BsToggleOn,
  BsToggleOff,
  BsPercent,
  BsCurrencyDollar,
  BsCalendar,
  BsTag,
  BsClock,
  BsCheckCircle,
  BsExclamationTriangle,
  BsXCircle,
  BsCopy,
  BsGift,
  BsCart,
  BsPeople,
  BsBarChart,
  BsGraphUp,
  BsShop,
} from "react-icons/bs";

export default function Discounts() {
  // State management
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // Mock discount data
  const mockDiscounts = [
    {
      id: 1,
      name: "New Year Sale",
      code: "NEWYEAR2025",
      type: "percentage",
      value: 20,
      description: "20% off on all products for New Year celebration",
      usage_limit: 100,
      used_count: 45,
      minimum_order: 50,
      maximum_discount: 200,
      start_date: "2025-01-01T00:00:00Z",
      end_date: "2025-01-31T23:59:59Z",
      status: "active",
      categories: ["all"],
      first_time_only: false,
      created_at: "2024-12-15T10:30:00Z",
      updated_at: "2024-12-15T10:30:00Z",
    },
    {
      id: 2,
      name: "First Time Customer",
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      description: "10% discount for first-time customers",
      usage_limit: 500,
      used_count: 234,
      minimum_order: 25,
      maximum_discount: 50,
      start_date: "2024-12-01T00:00:00Z",
      end_date: "2025-12-31T23:59:59Z",
      status: "active",
      categories: ["all"],
      first_time_only: true,
      created_at: "2024-12-01T08:45:00Z",
      updated_at: "2024-12-01T08:45:00Z",
    },
    {
      id: 3,
      name: "Free Delivery",
      code: "FREESHIP",
      type: "fixed",
      value: 15,
      description: "Free standard delivery on orders over GH₵100",
      usage_limit: 200,
      used_count: 89,
      minimum_order: 100,
      maximum_discount: 15,
      start_date: "2025-01-01T00:00:00Z",
      end_date: "2025-03-31T23:59:59Z",
      status: "active",
      categories: ["all"],
      first_time_only: false,
      created_at: "2024-12-20T14:20:00Z",
      updated_at: "2024-12-20T14:20:00Z",
    },
    {
      id: 4,
      name: "Kitchen Sale",
      code: "KITCHEN25",
      type: "percentage",
      value: 25,
      description: "25% off on all kitchen and dining products",
      usage_limit: 75,
      used_count: 12,
      minimum_order: 75,
      maximum_discount: 150,
      start_date: "2025-02-01T00:00:00Z",
      end_date: "2025-02-14T23:59:59Z",
      status: "scheduled",
      categories: ["Kitchen & Dining"],
      first_time_only: false,
      created_at: "2025-01-10T11:15:00Z",
      updated_at: "2025-01-10T11:15:00Z",
    },
    {
      id: 5,
      name: "Black Friday 2024",
      code: "BLACKFRIDAY50",
      type: "percentage",
      value: 50,
      description: "Massive 50% off on selected items for Black Friday",
      usage_limit: 300,
      used_count: 287,
      minimum_order: 100,
      maximum_discount: 500,
      start_date: "2024-11-29T00:00:00Z",
      end_date: "2024-11-29T23:59:59Z",
      status: "expired",
      categories: ["Electronics", "Home & Living"],
      first_time_only: false,
      created_at: "2024-11-20T16:00:00Z",
      updated_at: "2024-11-30T00:00:00Z",
    },
    {
      id: 6,
      name: "VIP Customer Reward",
      code: "VIP15",
      type: "fixed",
      value: 30,
      description: "GH₵30 off for VIP customers",
      usage_limit: 50,
      used_count: 8,
      minimum_order: 150,
      maximum_discount: 30,
      start_date: "2025-01-15T00:00:00Z",
      end_date: "2025-06-15T23:59:59Z",
      status: "active",
      categories: ["all"],
      first_time_only: false,
      created_at: "2025-01-12T13:30:00Z",
      updated_at: "2025-01-12T13:30:00Z",
    },
  ];

  // Component mount
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      // Using mock data for now
      setTimeout(() => {
        setDiscounts(mockDiscounts);
        setLoading(false);
        console.log('Using mock discounts for now');
      }, 1000);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Failed to load discounts');
      setLoading(false);
    }
  };

  // Filter and sort discounts
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = 
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || discount.status === statusFilter;
    const matchesType = typeFilter === "all" || discount.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "created_at":
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case "end_date":
        aValue = new Date(a.end_date);
        bValue = new Date(b.end_date);
        break;
      case "used_count":
        aValue = a.used_count;
        bValue = b.used_count;
        break;
      case "value":
        aValue = a.value;
        bValue = b.value;
        break;
      default:
        return 0;
    }

    if (sortOrder === "desc") {
      return bValue > aValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDiscounts.length / itemsPerPage);
  const paginatedDiscounts = sortedDiscounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getStatusBadge = (discount) => {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = new Date(discount.end_date);

    let status = discount.status;
    let config;

    // Determine actual status based on dates
    if (now < startDate) {
      status = "scheduled";
    } else if (now > endDate) {
      status = "expired";
    } else if (discount.used_count >= discount.usage_limit) {
      status = "used_up";
    }

    const statusConfig = {
      active: { class: "bg-success", icon: BsCheckCircle, text: "Active" },
      scheduled: { class: "bg-info", icon: BsClock, text: "Scheduled" },
      expired: { class: "bg-secondary", icon: BsXCircle, text: "Expired" },
      used_up: { class: "bg-warning", icon: BsExclamationTriangle, text: "Used Up" },
      inactive: { class: "bg-danger", icon: BsXCircle, text: "Inactive" }
    };

    config = statusConfig[status] || statusConfig.active;
    const IconComponent = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <IconComponent className="me-1" size={12} />
        {config.text}
      </span>
    );
  };

  const getDiscountTypeBadge = (type, value) => {
    return type === "percentage" ? (
      <span className="badge bg-primary d-flex align-items-center">
        <BsPercent className="me-1" size={12} />
        {value}% Off
      </span>
    ) : (
      <span className="badge bg-success d-flex align-items-center">
        <BsCurrencyDollar className="me-1" size={12} />
        GH₵{value} Off
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  const copyDiscountCode = (code) => {
    navigator.clipboard.writeText(code);
    // Could show a toast notification here
    console.log(`Copied discount code: ${code}`);
  };

  const toggleDiscountStatus = async (discountId) => {
    try {
      // TODO: Implement actual API call
      setDiscounts(prev => prev.map(discount => 
        discount.id === discountId 
          ? { ...discount, status: discount.status === 'active' ? 'inactive' : 'active' }
          : discount
      ));
    } catch (error) {
      console.error('Error toggling discount status:', error);
    }
  };

  const handleDiscountSelect = (discountId) => {
    setSelectedDiscounts(prev => 
      prev.includes(discountId)
        ? prev.filter(id => id !== discountId)
        : [...prev, discountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDiscounts.length === paginatedDiscounts.length) {
      setSelectedDiscounts([]);
    } else {
      setSelectedDiscounts(paginatedDiscounts.map(d => d.id));
    }
  };

  const viewDiscountDetails = (discount) => {
    setSelectedDiscount(discount);
    setShowDiscountModal(true);
  };

  // Statistics
  const stats = {
    total: discounts.length,
    active: discounts.filter(d => d.status === 'active').length,
    scheduled: discounts.filter(d => d.status === 'scheduled').length,
    expired: discounts.filter(d => d.status === 'expired').length,
    totalUsed: discounts.reduce((sum, d) => sum + d.used_count, 0),
    averageDiscount: discounts.length > 0 ? 
      Math.round(discounts.reduce((sum, d) => sum + d.value, 0) / discounts.length) : 0
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading discounts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <BsExclamationTriangle className="me-2" />
        {error}
        <button className="btn btn-outline-danger ms-auto" onClick={fetchDiscounts}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">Discounts & Promotions</h1>
          <p className="text-muted mb-0">Manage promotional offers and discount codes</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={fetchDiscounts}>
            <BsArrowClockwise className="me-1" />
            Refresh
          </button>
          <button className="btn btn-outline-secondary">
            <BsDownload className="me-1" />
            Export Discounts
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddDiscount(true)}>
            <BsPlus className="me-1" />
            Create Discount
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-primary bg-opacity-10 rounded">
                  <BsTag className="text-primary" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Discounts</p>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-success bg-opacity-10 rounded">
                  <BsCheckCircle className="text-success" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Active</p>
                  <h4 className="mb-0">{stats.active}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-info bg-opacity-10 rounded">
                  <BsClock className="text-info" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Scheduled</p>
                  <h4 className="mb-0">{stats.scheduled}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-secondary bg-opacity-10 rounded">
                  <BsXCircle className="text-secondary" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Expired</p>
                  <h4 className="mb-0">{stats.expired}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-warning bg-opacity-10 rounded">
                  <BsGraphUp className="text-warning" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Uses</p>
                  <h4 className="mb-0">{stats.totalUsed}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-info bg-opacity-10 rounded">
                  <BsPercent className="text-info" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Avg Discount</p>
                  <h4 className="mb-0">{stats.averageDiscount}%</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <BsSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search discounts, codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="created_at-desc">Newest First</option>
                <option value="end_date-asc">Expiring Soon</option>
                <option value="used_count-desc">Most Used</option>
                <option value="value-desc">Highest Value</option>
                <option value="name-asc">Name A-Z</option>
              </select>
            </div>
            <div className="col-md-2">
              {selectedDiscounts.length > 0 && (
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    Actions ({selectedDiscounts.length})
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item">Activate Selected</button></li>
                    <li><button className="dropdown-item">Deactivate Selected</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger">Delete Selected</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={selectedDiscounts.length === paginatedDiscounts.length && paginatedDiscounts.length > 0}
              onChange={handleSelectAll}
            />
            <span className="fw-semibold">
              Discounts ({filteredDiscounts.length})
            </span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th width="50">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedDiscounts.length === paginatedDiscounts.length && paginatedDiscounts.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Discount</th>
                <th>Code</th>
                <th>Type</th>
                <th>Usage</th>
                <th>Valid Period</th>
                <th>Status</th>
                <th width="120">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDiscounts.map(discount => (
                <tr key={discount.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedDiscounts.includes(discount.id)}
                      onChange={() => handleDiscountSelect(discount.id)}
                    />
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">{discount.name}</div>
                      <div className="text-muted small">{discount.description}</div>
                      {discount.first_time_only && (
                        <span className="badge bg-info text-dark small">First Time Only</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <code className="bg-light p-1 rounded me-2">{discount.code}</code>
                      <button 
                        className="btn btn-sm btn-outline-secondary p-1"
                        onClick={() => copyDiscountCode(discount.code)}
                        title="Copy code"
                      >
                        <BsCopy size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div>
                      {getDiscountTypeBadge(discount.type, discount.value)}
                      {discount.minimum_order > 0 && (
                        <div className="text-muted small">Min: GH₵{discount.minimum_order}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small>{discount.used_count}/{discount.usage_limit}</small>
                        <small className="text-muted">{getUsagePercentage(discount.used_count, discount.usage_limit)}%</small>
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div
                          className="progress-bar"
                          style={{ 
                            width: `${getUsagePercentage(discount.used_count, discount.usage_limit)}%`,
                            backgroundColor: getUsagePercentage(discount.used_count, discount.usage_limit) > 80 ? '#dc3545' : '#0d6efd'
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="small">
                      <div>{formatDateShort(discount.start_date)} - {formatDateShort(discount.end_date)}</div>
                      <div className="text-muted">
                        {new Date(discount.end_date) > new Date() ? 
                          `Ends in ${Math.ceil((new Date(discount.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days` :
                          'Expired'
                        }
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(discount)}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary" 
                        onClick={() => viewDiscountDetails(discount)}
                        title="View Details"
                      >
                        <BsEye />
                      </button>
                      <div className="dropdown">
                        <button 
                          className="btn btn-outline-secondary dropdown-toggle" 
                          data-bs-toggle="dropdown"
                          title="More Actions"
                        >
                          <BsThreeDotsVertical />
                        </button>
                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item"><BsEye className="me-1" /> View Details</button></li>
                          <li><button className="dropdown-item"><BsCopy className="me-1" /> Copy Code</button></li>
                          <li><button className="dropdown-item"><BsPencilSquare className="me-1" /> Edit</button></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={() => toggleDiscountStatus(discount.id)}
                            >
                              {discount.status === 'active' ? (
                                <><BsToggleOff className="me-1" /> Deactivate</>
                              ) : (
                                <><BsToggleOn className="me-1" /> Activate</>
                              )}
                            </button>
                          </li>
                          <li><button className="dropdown-item text-danger"><BsTrash className="me-1" /> Delete</button></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredDiscounts.length)} of{' '}
            {filteredDiscounts.length} discounts
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum <= totalPages) {
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                }
                return null;
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Add Discount Modal Placeholder */}
      {showAddDiscount && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Discount</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddDiscount(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">Create Discount form will be implemented next...</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddDiscount(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">Create Discount</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discount Details Modal */}
      {showDiscountModal && selectedDiscount && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header border-bottom">
                <h4 className="modal-title fw-bold d-flex align-items-center">
                  <BsTag className="text-primary me-2" />
                  {selectedDiscount.name}
                </h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDiscountModal(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Discount Info */}
                  <div className="col-lg-8">
                    {/* Basic Information */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold">Discount Details</h6>
                        <div>
                          {getDiscountTypeBadge(selectedDiscount.type, selectedDiscount.value)}
                          {getStatusBadge(selectedDiscount)}
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Discount Code:</strong>
                              <code className="ms-2 bg-light p-1 rounded">{selectedDiscount.code}</code>
                              <button 
                                className="btn btn-sm btn-outline-secondary ms-1 p-1"
                                onClick={() => copyDiscountCode(selectedDiscount.code)}
                              >
                                <BsCopy size={12} />
                              </button>
                            </p>
                            <p className="mb-2">
                              <strong>Description:</strong><br />
                              <span className="text-muted">{selectedDiscount.description}</span>
                            </p>
                            <p className="mb-2">
                              <strong>Minimum Order:</strong> GH₵{selectedDiscount.minimum_order}
                            </p>
                            {selectedDiscount.maximum_discount && (
                              <p className="mb-2">
                                <strong>Maximum Discount:</strong> GH₵{selectedDiscount.maximum_discount}
                              </p>
                            )}
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Valid From:</strong> {formatDate(selectedDiscount.start_date)}
                            </p>
                            <p className="mb-2">
                              <strong>Valid Until:</strong> {formatDate(selectedDiscount.end_date)}
                            </p>
                            <p className="mb-2">
                              <strong>Usage Limit:</strong> {selectedDiscount.usage_limit} uses
                            </p>
                            <p className="mb-2">
                              <strong>Times Used:</strong> {selectedDiscount.used_count} times
                            </p>
                            {selectedDiscount.first_time_only && (
                              <p className="mb-0">
                                <span className="badge bg-info">First-time customers only</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Restrictions */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Applicable Categories</h6>
                      </div>
                      <div className="card-body">
                        {selectedDiscount.categories.includes('all') ? (
                          <span className="badge bg-success">All Categories</span>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {selectedDiscount.categories.map((category, index) => (
                              <span key={index} className="badge bg-primary">
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Usage Analytics */}
                    <div className="card shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Usage Analytics</h6>
                      </div>
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-3">
                            <h4 className="mb-1 text-primary">{selectedDiscount.used_count}</h4>
                            <small className="text-muted">Times Used</small>
                          </div>
                          <div className="col-3">
                            <h4 className="mb-1 text-warning">{selectedDiscount.usage_limit - selectedDiscount.used_count}</h4>
                            <small className="text-muted">Remaining</small>
                          </div>
                          <div className="col-3">
                            <h4 className="mb-1 text-info">{getUsagePercentage(selectedDiscount.used_count, selectedDiscount.usage_limit)}%</h4>
                            <small className="text-muted">Used</small>
                          </div>
                          <div className="col-3">
                            <h4 className="mb-1 text-success">
                              {selectedDiscount.type === 'percentage' ? `${selectedDiscount.value}%` : `GH₵${selectedDiscount.value}`}
                            </h4>
                            <small className="text-muted">Discount</small>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small>Usage Progress</small>
                            <small>{selectedDiscount.used_count}/{selectedDiscount.usage_limit}</small>
                          </div>
                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{ 
                                width: `${getUsagePercentage(selectedDiscount.used_count, selectedDiscount.usage_limit)}%`,
                                backgroundColor: getUsagePercentage(selectedDiscount.used_count, selectedDiscount.usage_limit) > 80 ? '#dc3545' : '#0d6efd'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Actions & Quick Info */}
                  <div className="col-lg-4">
                    {/* Quick Actions */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Quick Actions</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => copyDiscountCode(selectedDiscount.code)}
                          >
                            <BsCopy className="me-1" />
                            Copy Discount Code
                          </button>
                          <button className="btn btn-outline-primary btn-sm">
                            <BsPencilSquare className="me-1" />
                            Edit Discount
                          </button>
                          <button 
                            className={`btn btn-outline-${selectedDiscount.status === 'active' ? 'warning' : 'success'} btn-sm`}
                            onClick={() => toggleDiscountStatus(selectedDiscount.id)}
                          >
                            {selectedDiscount.status === 'active' ? (
                              <><BsToggleOff className="me-1" /> Deactivate</>
                            ) : (
                              <><BsToggleOn className="me-1" /> Activate</>
                            )}
                          </button>
                          <hr />
                          <button className="btn btn-outline-info btn-sm">
                            <BsBarChart className="me-1" />
                            View Usage Report
                          </button>
                          <button className="btn btn-outline-secondary btn-sm">
                            <BsGift className="me-1" />
                            Duplicate Discount
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Discount Status */}
                    <div className="card shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Status Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <small className="text-muted">Current Status</small>
                          <div className="mt-1">{getStatusBadge(selectedDiscount)}</div>
                        </div>
                        
                        <div className="mb-3">
                          <small className="text-muted">Time Remaining</small>
                          <div className="fw-semibold">
                            {new Date(selectedDiscount.end_date) > new Date() ? 
                              `${Math.ceil((new Date(selectedDiscount.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days left` :
                              'Expired'}
                          </div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">Created</small>
                          <div className="fw-semibold">{formatDate(selectedDiscount.created_at)}</div>
                        </div>

                        <div>
                          <small className="text-muted">Last Updated</small>
                          <div className="fw-semibold">{formatDate(selectedDiscount.updated_at)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDiscountModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <BsDownload className="me-1" />
                  Export Report
                </button>
                <button type="button" className="btn btn-primary">
                  <BsPencilSquare className="me-1" />
                  Edit Discount
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}