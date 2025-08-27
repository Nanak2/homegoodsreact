// client/src/pages/admin/Customers.jsx
import React, { useState, useEffect } from "react";
import {
  BsSearch,
  BsFilter,
  BsDownload,
  BsEye,
  BsThreeDotsVertical,
  BsArrowClockwise,
  BsExclamationTriangle,
  BsPerson,
  BsTelephone,
  BsEnvelope,
  BsGeoAlt,
  BsCalendar,
  BsCurrencyDollar,
  BsBoxSeam,
  BsChat,
  BsPencilSquare,
  BsTrash,
  BsPersonPlus,
  BsGraphUp,
  BsGraphDown,
  BsArrowUpRight,
  BsArrowDownRight,
  BsStar,
  BsStarFill,
} from "react-icons/bs";

export default function Customers() {
  // State management
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerType, setCustomerType] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Mock customer data
  const mockCustomers = [
    {
      id: 1,
      name: "Kwame Asante",
      email: "kwame.asante@gmail.com",
      phone: "+233 24 123 4567",
      address: "East Legon, Accra",
      city: "Accra",
      region: "Greater Accra",
      created_at: "2024-11-15T10:30:00Z",
      last_order_at: "2025-01-10T14:20:00Z",
      total_orders: 8,
      total_spent: 1245.50,
      average_order: 155.69,
      status: "active",
      customer_type: "vip",
      lifetime_value: 1850.00,
      last_activity: "2025-01-10T16:45:00Z",
      preferences: ["Kitchen & Dining", "Electronics"],
      notes: "Prefers delivery in the evening",
    },
    {
      id: 2,
      name: "Ama Osei",
      email: "ama.osei@yahoo.com",
      phone: "+233 20 987 6543",
      address: "Tema, Greater Accra",
      city: "Tema",
      region: "Greater Accra",
      created_at: "2024-12-02T15:45:00Z",
      last_order_at: "2025-01-08T11:30:00Z",
      total_orders: 5,
      total_spent: 678.90,
      average_order: 135.78,
      status: "active",
      customer_type: "regular",
      lifetime_value: 950.00,
      last_activity: "2025-01-08T12:15:00Z",
      preferences: ["Home & Living", "Personal Care"],
      notes: "Usually picks up orders from store",
    },
    {
      id: 3,
      name: "Kofi Mensah",
      email: null,
      phone: "+233 55 456 7890",
      address: "Bantama Road, Kumasi",
      city: "Kumasi",
      region: "Ashanti",
      created_at: "2024-10-20T09:15:00Z",
      last_order_at: "2025-01-05T16:00:00Z",
      total_orders: 12,
      total_spent: 2134.75,
      average_order: 177.90,
      status: "active",
      customer_type: "vip",
      lifetime_value: 2850.00,
      last_activity: "2025-01-05T17:30:00Z",
      preferences: ["Garden & Outdoor", "Kitchen & Dining"],
      notes: "Bulk orders for restaurant business",
    },
    {
      id: 4,
      name: "Akosua Boateng",
      email: "akosua.b@outlook.com",
      phone: "+233 26 111 2222",
      address: "Spintex Road, Accra",
      city: "Accra",
      region: "Greater Accra",
      created_at: "2024-09-12T14:30:00Z",
      last_order_at: "2024-12-20T10:45:00Z",
      total_orders: 3,
      total_spent: 345.20,
      average_order: 115.07,
      status: "inactive",
      customer_type: "new",
      lifetime_value: 480.00,
      last_activity: "2024-12-20T11:00:00Z",
      preferences: ["Electronics"],
      notes: "Price-sensitive customer",
    },
    {
      id: 5,
      name: "Yaw Adjei",
      email: "yawadjei@hotmail.com",
      phone: "+233 24 555 8888",
      address: "Dansoman, Accra",
      city: "Accra",
      region: "Greater Accra",
      created_at: "2024-08-05T12:00:00Z",
      last_order_at: "2025-01-12T09:20:00Z",
      total_orders: 15,
      total_spent: 3245.80,
      average_order: 216.39,
      status: "active",
      customer_type: "vip",
      lifetime_value: 4200.00,
      last_activity: "2025-01-12T10:00:00Z",
      preferences: ["Electronics", "Home & Living", "Kitchen & Dining"],
      notes: "Company orders for office supplies",
    },
    {
      id: 6,
      name: "Efua Appiah",
      email: "efua.appiah@gmail.com",
      phone: "+233 54 777 3333",
      address: "Takoradi, Western Region",
      city: "Takoradi",
      region: "Western",
      created_at: "2025-01-01T08:30:00Z",
      last_order_at: "2025-01-01T08:30:00Z",
      total_orders: 1,
      total_spent: 89.99,
      average_order: 89.99,
      status: "active",
      customer_type: "new",
      lifetime_value: 120.00,
      last_activity: "2025-01-01T09:15:00Z",
      preferences: [],
      notes: "First-time customer from social media ad",
    },
  ];

  // Component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // For now, use mock customers since the API endpoint doesn't exist yet
      // TODO: Implement /api/admin/customers endpoint later
      setTimeout(() => {
        setCustomers(mockCustomers);
        setLoading(false);
        console.log('Using mock customers for now');
      }, 1000);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers');
      setLoading(false);
    }
  };

  // Filter and sort customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = customerType === "all" || customer.customer_type === customerType;

    return matchesSearch && matchesType;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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
      case "total_spent":
        aValue = a.total_spent;
        bValue = b.total_spent;
        break;
      case "total_orders":
        aValue = a.total_orders;
        bValue = b.total_orders;
        break;
      case "last_order_at":
        aValue = new Date(a.last_order_at);
        bValue = new Date(b.last_order_at);
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
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getCustomerTypeBadge = (type) => {
    const typeConfig = {
      vip: { class: "bg-warning", icon: BsStarFill, text: "VIP" },
      regular: { class: "bg-primary", icon: BsPerson, text: "Regular" },
      new: { class: "bg-success", icon: BsPersonPlus, text: "New" },
    };

    const config = typeConfig[type] || typeConfig.regular;
    const IconComponent = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <IconComponent className="me-1" size={12} />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="badge bg-success">Active</span>
    ) : (
      <span className="badge bg-secondary">Inactive</span>
    );
  };

  const formatPrice = (price) => `GH₵${price.toFixed(2)}`;

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

  const getDaysSinceLastOrder = (dateString) => {
    const lastOrder = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - lastOrder);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map(c => c.id));
    }
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Statistics
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.customer_type === 'vip').length,
    new: customers.filter(c => c.customer_type === 'new').length,
    totalSpent: customers.reduce((sum, c) => sum + c.total_spent, 0),
    averageOrderValue: customers.length > 0 ? 
      customers.reduce((sum, c) => sum + c.average_order, 0) / customers.length : 0
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading customers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <BsExclamationTriangle className="me-2" />
        {error}
        <button className="btn btn-outline-danger ms-auto" onClick={fetchCustomers}>
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
          <h1 className="fw-bold mb-1">Customers</h1>
          <p className="text-muted mb-0">Manage customer relationships and insights</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={fetchCustomers}>
            <BsArrowClockwise className="me-1" />
            Refresh
          </button>
          <button className="btn btn-outline-secondary">
            <BsDownload className="me-1" />
            Export Customers
          </button>
          <button className="btn btn-primary">
            <BsPersonPlus className="me-1" />
            Add Customer
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
                  <BsPerson className="text-primary" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Customers</p>
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
                  <BsGraphUp className="text-success" />
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
                <div className="me-3 p-3 bg-warning bg-opacity-10 rounded">
                  <BsStarFill className="text-warning" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">VIP</p>
                  <h4 className="mb-0">{stats.vip}</h4>
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
                  <BsPersonPlus className="text-info" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">New</p>
                  <h4 className="mb-0">{stats.new}</h4>
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
                  <BsCurrencyDollar className="text-success" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Revenue</p>
                  <h4 className="mb-0 small">{formatPrice(stats.totalSpent)}</h4>
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
                  <BsBoxSeam className="text-info" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Avg Order</p>
                  <h4 className="mb-0 small">{formatPrice(stats.averageOrderValue)}</h4>
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
                  placeholder="Search customers, phones, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="vip">VIP Customers</option>
                <option value="regular">Regular</option>
                <option value="new">New Customers</option>
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
                <option value="last_order_at-desc">Recent Orders</option>
                <option value="total_spent-desc">Highest Spenders</option>
                <option value="total_orders-desc">Most Orders</option>
                <option value="name-asc">Name A-Z</option>
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select">
                <option value="all">All Regions</option>
                <option value="greater-accra">Greater Accra</option>
                <option value="ashanti">Ashanti</option>
                <option value="western">Western</option>
              </select>
            </div>
            <div className="col-md-2">
              {selectedCustomers.length > 0 && (
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    Actions ({selectedCustomers.length})
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item">Send Email Campaign</button></li>
                    <li><button className="dropdown-item">Export Selected</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger">Archive Selected</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
              onChange={handleSelectAll}
            />
            <span className="fw-semibold">
              Customers ({filteredCustomers.length})
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
                    checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Type</th>
                <th>Last Order</th>
                <th>Status</th>
                <th width="120">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerSelect(customer.id)}
                    />
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">{customer.name}</div>
                      <small className="text-muted">
                        Customer since {formatDate(customer.created_at)}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="text-muted small d-flex align-items-center mb-1">
                        <BsTelephone size={12} className="me-1" />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="text-muted small d-flex align-items-center">
                          <BsEnvelope size={12} className="me-1" />
                          {customer.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="text-muted small d-flex align-items-center">
                      <BsGeoAlt size={12} className="me-1" />
                      {customer.city}, {customer.region}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">{customer.total_orders}</div>
                      <small className="text-muted">{formatPrice(customer.average_order)} avg</small>
                    </div>
                  </td>
                  <td className="fw-semibold">{formatPrice(customer.total_spent)}</td>
                  <td>{getCustomerTypeBadge(customer.customer_type)}</td>
                  <td>
                    <div className="small">
                      <div>{formatDateShort(customer.last_order_at)}</div>
                      <div className="text-muted">
                        {getDaysSinceLastOrder(customer.last_order_at)} days ago
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(customer.status)}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary" 
                        onClick={() => viewCustomerDetails(customer)}
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
                          <li><button className="dropdown-item"><BsEye className="me-1" /> View Profile</button></li>
                          <li><button className="dropdown-item"><BsBoxSeam className="me-1" /> View Orders</button></li>
                          <li><button className="dropdown-item"><BsChat className="me-1" /> Send Message</button></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><button className="dropdown-item"><BsPencilSquare className="me-1" /> Edit</button></li>
                          <li><button className="dropdown-item text-danger"><BsTrash className="me-1" /> Archive</button></li>
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
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} customers
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

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header border-bottom">
                <h4 className="modal-title fw-bold d-flex align-items-center">
                  <BsPerson className="text-primary me-2" />
                  {selectedCustomer.name}
                </h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCustomerModal(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Customer Info */}
                  <div className="col-lg-8">
                    {/* Contact Information */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold">Contact Information</h6>
                        <div>
                          {getCustomerTypeBadge(selectedCustomer.customer_type)}
                          {getStatusBadge(selectedCustomer.status)}
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-2 d-flex align-items-center">
                              <BsTelephone className="me-2 text-muted" size={14} />
                              <strong>Phone:</strong> 
                              <a href={`tel:${selectedCustomer.phone}`} className="ms-2 text-decoration-none">
                                {selectedCustomer.phone}
                              </a>
                            </p>
                            {selectedCustomer.email && (
                              <p className="mb-2 d-flex align-items-center">
                                <BsEnvelope className="me-2 text-muted" size={14} />
                                <strong>Email:</strong>
                                <a href={`mailto:${selectedCustomer.email}`} className="ms-2 text-decoration-none">
                                  {selectedCustomer.email}
                                </a>
                              </p>
                            )}
                            <p className="mb-2 d-flex align-items-start">
                              <BsGeoAlt className="me-2 mt-1 text-muted" size={14} />
                              <span>
                                <strong>Address:</strong><br />
                                {selectedCustomer.address}
                              </span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2 d-flex align-items-center">
                              <BsCalendar className="me-2 text-muted" size={14} />
                              <strong>Customer Since:</strong> {formatDate(selectedCustomer.created_at)}
                            </p>
                            <p className="mb-2 d-flex align-items-center">
                              <BsBoxSeam className="me-2 text-muted" size={14} />
                              <strong>Last Order:</strong> {formatDate(selectedCustomer.last_order_at)}
                            </p>
                            <p className="mb-0">
                              <strong>Lifetime Value:</strong> {formatPrice(selectedCustomer.lifetime_value)}
                            </p>
                          </div>
                        </div>
                        {selectedCustomer.notes && (
                          <div className="mt-3 pt-3 border-top">
                            <strong>Notes:</strong>
                            <p className="text-muted mb-0">{selectedCustomer.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Purchase History Summary */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Purchase History</h6>
                      </div>
                      <div className="card-body">
                        <div className="row text-center">
                          <div className="col-3">
                            <div className="border-end">
                              <h4 className="mb-1 text-primary">{selectedCustomer.total_orders}</h4>
                              <small className="text-muted">Total Orders</small>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="border-end">
                              <h4 className="mb-1 text-success">{formatPrice(selectedCustomer.total_spent)}</h4>
                              <small className="text-muted">Total Spent</small>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="border-end">
                              <h4 className="mb-1 text-info">{formatPrice(selectedCustomer.average_order)}</h4>
                              <small className="text-muted">Average Order</small>
                            </div>
                          </div>
                          <div className="col-3">
                            <h4 className="mb-1 text-warning">{formatPrice(selectedCustomer.lifetime_value)}</h4>
                            <small className="text-muted">Lifetime Value</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    {selectedCustomer.preferences && selectedCustomer.preferences.length > 0 && (
                      <div className="card shadow-sm">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 fw-semibold">Shopping Preferences</h6>
                        </div>
                        <div className="card-body">
                          <div className="d-flex flex-wrap gap-2">
                            {selectedCustomer.preferences.map((preference, index) => (
                              <span key={index} className="badge bg-light text-dark">
                                {preference}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Actions & Quick Stats */}
                  <div className="col-lg-4">
                    {/* Quick Actions */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Quick Actions</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-grid gap-2">
                          <button className="btn btn-primary btn-sm">
                            <BsBoxSeam className="me-1" />
                            View All Orders
                          </button>
                          <button className="btn btn-outline-primary btn-sm">
                            <BsTelephone className="me-1" />
                            Call Customer
                          </button>
                          {selectedCustomer.email && (
                            <button className="btn btn-outline-secondary btn-sm">
                              <BsEnvelope className="me-1" />
                              Send Email
                            </button>
                          )}
                          <button className="btn btn-outline-info btn-sm">
                            <BsChat className="me-1" />
                            Send Message
                          </button>
                          <hr />
                          <button className="btn btn-outline-warning btn-sm">
                            <BsPencilSquare className="me-1" />
                            Edit Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Customer Insights */}
                    <div className="card shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Customer Insights</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <small className="text-muted">Days since last order</small>
                          <div className="h5">{getDaysSinceLastOrder(selectedCustomer.last_order_at)} days</div>
                        </div>
                        
                        <div className="mb-3">
                          <small className="text-muted">Activity Level</small>
                          <div className={`fw-semibold ${
                            getDaysSinceLastOrder(selectedCustomer.last_order_at) < 30 ? 'text-success' :
                            getDaysSinceLastOrder(selectedCustomer.last_order_at) < 60 ? 'text-warning' : 'text-danger'
                          }`}>
                            {getDaysSinceLastOrder(selectedCustomer.last_order_at) < 30 ? 'Highly Active' :
                             getDaysSinceLastOrder(selectedCustomer.last_order_at) < 60 ? 'Moderately Active' : 'At Risk'}
                          </div>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">Order Frequency</small>
                          <div className="fw-semibold">
                            {selectedCustomer.total_orders > 10 ? 'Frequent Buyer' :
                             selectedCustomer.total_orders > 5 ? 'Regular Customer' :
                             selectedCustomer.total_orders > 1 ? 'Occasional Buyer' : 'New Customer'}
                          </div>
                        </div>

                        <div>
                          <small className="text-muted">Spending Pattern</small>
                          <div className="fw-semibold">
                            {selectedCustomer.average_order > 200 ? 'High Value' :
                             selectedCustomer.average_order > 100 ? 'Medium Value' : 'Budget Conscious'}
                          </div>
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
                  onClick={() => setShowCustomerModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <BsDownload className="me-1" />
                  Export Profile
                </button>
                <button type="button" className="btn btn-primary">
                  <BsPencilSquare className="me-1" />
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}