// client/src/pages/admin/Orders.jsx
import React, { useState, useEffect } from "react";
import {
  BsSearch,
  BsFilter,
  BsDownload,
  BsEye,
  BsCheck,
  BsX,
  BsThreeDotsVertical,
  BsArrowClockwise,
  BsTruck,
  BsShop,
  BsExclamationTriangle,
  BsCheckCircle,
  BsClock,
  BsXCircle,
  BsPerson,
  BsTelephone,
  BsEnvelope,
  BsGeoAlt,
  BsBoxSeam,
  BsCalendar,
  BsCurrencyDollar,
} from "react-icons/bs";

export default function Orders() {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Mock data for development - replace with API calls later
  const mockOrders = [
    {
      id: "GH001",
      customer_id: 1,
      customer: {
        id: 1,
        name: "Kwame Asante",
        phone: "+233 24 123 4567",
        email: "kwame.asante@gmail.com",
        address: "East Legon, Accra"
      },
      fulfillment_method: "delivery",
      delivery_street: "Ring Road East",
      delivery_city: "Accra",
      delivery_notes: "Call when you arrive at the gate",
      pickup_notes: null,
      total_amount: 459.99,
      item_count: 3,
      status: "pending",
      payment_method: null,
      payment_status: "pending",
      order_name: "Kwame Asante",
      source: "website",
      created_at: "2025-01-15T14:30:00Z",
      updated_at: "2025-01-15T14:30:00Z",
      items: [
        {
          id: 1,
          product_id: 101,
          name: "Premium Ceramic Dinner Set",
          price: 129.99,
          quantity: 2,
          subtotal: 259.98
        },
        {
          id: 2,
          product_id: 102,
          name: "Luxury Bath Towel Set",
          price: 79.99,
          quantity: 1,
          subtotal: 79.99
        },
        {
          id: 3,
          product_id: 103,
          name: "Smart LED Table Lamp",
          price: 49.99,
          quantity: 1,
          subtotal: 49.99
        }
      ]
    },
    {
      id: "GH002",
      customer_id: 2,
      customer: {
        id: 2,
        name: "Ama Osei",
        phone: "+233 20 987 6543",
        email: "ama.osei@yahoo.com",
        address: "Tema, Greater Accra"
      },
      fulfillment_method: "pickup",
      delivery_street: null,
      delivery_city: null,
      delivery_notes: null,
      pickup_notes: "Pickup between 2-4 PM",
      total_amount: 199.99,
      item_count: 1,
      status: "confirmed",
      payment_method: "mobile_money",
      payment_status: "paid",
      order_name: "Ama Osei",
      source: "phone",
      created_at: "2025-01-14T09:15:00Z",
      updated_at: "2025-01-14T11:20:00Z",
      items: [
        {
          id: 4,
          product_id: 105,
          name: "Professional Kitchen Knives",
          price: 199.99,
          quantity: 1,
          subtotal: 199.99
        }
      ]
    },
    {
      id: "GH003",
      customer_id: 3,
      customer: {
        id: 3,
        name: "Kofi Mensah",
        phone: "+233 55 456 7890",
        email: null,
        address: "Kumasi, Ashanti Region"
      },
      fulfillment_method: "delivery",
      delivery_street: "Bantama Road",
      delivery_city: "Kumasi",
      delivery_notes: "Leave at reception if not available",
      pickup_notes: null,
      total_amount: 89.99,
      item_count: 2,
      status: "completed",
      payment_method: "cash",
      payment_status: "paid",
      order_name: "Kofi Mensah",
      source: "website",
      created_at: "2025-01-13T16:45:00Z",
      updated_at: "2025-01-13T18:30:00Z",
      items: [
        {
          id: 5,
          product_id: 104,
          name: "Outdoor Garden Planters",
          price: 89.99,
          quantity: 1,
          subtotal: 89.99
        }
      ]
    },
    {
      id: "GH004",
      customer_id: 4,
      customer: {
        id: 4,
        name: "Akosua Boateng",
        phone: "+233 26 111 2222",
        email: "akosua.b@outlook.com",
        address: "Spintex, Accra"
      },
      fulfillment_method: "delivery",
      delivery_street: "Spintex Road",
      delivery_city: "Accra",
      delivery_notes: null,
      pickup_notes: null,
      total_amount: 0,
      item_count: 1,
      status: "cancelled",
      payment_method: null,
      payment_status: "cancelled",
      order_name: "Akosua Boateng",
      source: "website",
      created_at: "2025-01-12T12:00:00Z",
      updated_at: "2025-01-12T13:15:00Z",
      items: [
        {
          id: 6,
          product_id: 103,
          name: "Smart LED Table Lamp",
          price: 49.99,
          quantity: 1,
          subtotal: 49.99
        }
      ]
    }
  ];

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // For now, use mock orders since the API endpoint doesn't exist yet
      // TODO: Implement /api/admin/orders endpoint later
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
        console.log('Using mock orders for now');
      }, 1000);
      
      // Commented out until API endpoint is created
      // const response = await fetch('http://localhost:5001/api/admin/orders');
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data = await response.json();
      // const transformedOrders = data.map(order => ({
      //   ...order,
      //   id: order.id.toString(),
      //   customer: {
      //     id: order.customer.id,
      //     name: order.customer.name,
      //     phone: order.customer.phone,
      //     email: order.customer.email || null,
      //     address: order.customer.address || ''
      //   },
      //   fulfillment_method: order.fulfillment_method,
      //   total_amount: parseFloat(order.total_amount),
      //   item_count: order.item_count,
      //   status: order.status || 'pending',
      //   created_at: order.created_at,
      //   updated_at: order.updated_at,
      //   items: order.items || [],
      //   delivery_notes: order.delivery_notes,
      //   pickup_notes: order.pickup_notes,
      //   delivery_street: order.delivery_street,
      //   delivery_city: order.delivery_city,
      //   payment_method: order.payment_method || null,
      //   payment_status: order.payment_status || 'pending',
      //   order_name: order.order_name || order.customer.name,
      //   source: order.source || 'website'
      // }));
      // setOrders(transformedOrders);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm) ||
      (order.customer.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillment_method === fulfillmentFilter;

    return matchesSearch && matchesStatus && matchesFulfillment;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "created_at":
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case "total_amount":
        aValue = a.total_amount;
        bValue = b.total_amount;
        break;
      case "customer":
        aValue = a.customer.name.toLowerCase();
        bValue = b.customer.name.toLowerCase();
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
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
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", icon: BsClock, text: "Pending" },
      confirmed: { class: "bg-info", icon: BsCheckCircle, text: "Confirmed" },
      completed: { class: "bg-success", icon: BsCheck, text: "Completed" },
      cancelled: { class: "bg-danger", icon: BsXCircle, text: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <IconComponent className="me-1" size={12} />
        {config.text}
      </span>
    );
  };

  const getFulfillmentBadge = (method) => {
    return method === "delivery" ? (
      <span className="badge bg-primary d-flex align-items-center">
        <BsTruck className="me-1" size={12} />
        Delivery
      </span>
    ) : (
      <span className="badge bg-secondary d-flex align-items-center">
        <BsShop className="me-1" size={12} />
        Pickup
      </span>
    );
  };

  const formatPrice = (price) => `GH₵${price.toFixed(2)}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Order actions
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // For now, just update local state since API endpoint doesn't exist
      // TODO: Implement the actual API call when backend is ready
      console.log(`Mock: Updating order ${orderId} status to ${newStatus}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      // Update selected order in modal if it's open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }

      console.log(`Order ${orderId} status updated to ${newStatus} (mock)`);

      // Commented out until API endpoint is created
      // const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const result = await response.json();

    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status: ' + error.message);
    }
  };

  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(o => o.id));
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total_amount, 0)
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <BsExclamationTriangle className="me-2" />
        {error}
        <button className="btn btn-outline-danger ms-auto" onClick={fetchOrders}>
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
          <h1 className="fw-bold mb-1">Orders</h1>
          <p className="text-muted mb-0">Manage customer orders and fulfillment</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={fetchOrders}>
            <BsArrowClockwise className="me-1" />
            Refresh
          </button>
          <button className="btn btn-outline-secondary">
            <BsDownload className="me-1" />
            Export Orders
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
                  <BsBoxSeam className="text-primary" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Orders</p>
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
                <div className="me-3 p-3 bg-warning bg-opacity-10 rounded">
                  <BsClock className="text-warning" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Pending</p>
                  <h4 className="mb-0">{stats.pending}</h4>
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
                  <BsCheckCircle className="text-info" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Confirmed</p>
                  <h4 className="mb-0">{stats.confirmed}</h4>
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
                  <BsCheck className="text-success" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Completed</p>
                  <h4 className="mb-0">{stats.completed}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-danger bg-opacity-10 rounded">
                  <BsXCircle className="text-danger" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Cancelled</p>
                  <h4 className="mb-0">{stats.cancelled}</h4>
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
                  <p className="mb-1 text-muted small">Revenue</p>
                  <h4 className="mb-0 small">{formatPrice(stats.totalRevenue)}</h4>
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
                  placeholder="Search orders, customers, phones..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={fulfillmentFilter}
                onChange={(e) => setFulfillmentFilter(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
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
                <option value="created_at-asc">Oldest First</option>
                <option value="total_amount-desc">Highest Value</option>
                <option value="total_amount-asc">Lowest Value</option>
                <option value="customer-asc">Customer A-Z</option>
                <option value="status-asc">Status A-Z</option>
              </select>
            </div>
            <div className="col-md-2">
              {selectedOrders.length > 0 && (
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    Actions ({selectedOrders.length})
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => console.log('Mark as confirmed', selectedOrders)}>Mark as Confirmed</button></li>
                    <li><button className="dropdown-item" onClick={() => console.log('Mark as completed', selectedOrders)}>Mark as Completed</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={() => console.log('Cancel orders', selectedOrders)}>Cancel Selected</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <div className="d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
              onChange={handleSelectAll}
            />
            <span className="fw-semibold">
              Orders ({filteredOrders.length})
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
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Order</th>
                <th>Customer</th>
                <th>Fulfillment</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th width="120">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleOrderSelect(order.id)}
                    />
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">#{order.id}</div>
                      {order.source && (
                        <span className="badge bg-light text-dark small">
                          {order.source}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">{order.customer.name}</div>
                      <div className="text-muted small d-flex align-items-center">
                        <BsTelephone size={12} className="me-1" />
                        {order.customer.phone}
                      </div>
                      {order.customer.email && (
                        <div className="text-muted small d-flex align-items-center">
                          <BsEnvelope size={12} className="me-1" />
                          {order.customer.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="mb-1">
                      {getFulfillmentBadge(order.fulfillment_method)}
                    </div>
                    {order.fulfillment_method === 'delivery' && order.delivery_city && (
                      <div className="text-muted small d-flex align-items-center">
                        <BsGeoAlt size={12} className="me-1" />
                        {order.delivery_city}
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-secondary">
                      {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="fw-semibold">{formatPrice(order.total_amount)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="small">
                      <div>{formatDateShort(order.created_at)}</div>
                      <div className="text-muted">
                        {new Date(order.created_at).toLocaleTimeString('en-GB', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary" 
                        onClick={() => viewOrderDetails(order)}
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
                          {order.status === 'pending' && (
                            <>
                              <li>
                                <button 
                                  className="dropdown-item text-success"
                                  onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                >
                                  <BsCheck className="me-1" /> Confirm Order
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                >
                                  <BsX className="me-1" /> Cancel Order
                                </button>
                              </li>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <li>
                              <button 
                                className="dropdown-item text-success"
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                              >
                                <BsCheck className="me-1" /> Mark Complete
                              </button>
                            </li>
                          )}
                          {order.status !== 'cancelled' && (
                            <>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger"
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                >
                                  <BsX className="me-1" /> Cancel
                                </button>
                              </li>
                            </>
                          )}
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
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
            {filteredOrders.length} orders
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header border-bottom">
                <h4 className="modal-title fw-bold d-flex align-items-center">
                  <BsEye className="text-primary me-2" />
                  Order #{selectedOrder.id}
                </h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Order Info */}
                  <div className="col-lg-8">
                    {/* Customer Information */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold d-flex align-items-center">
                          <BsPerson className="me-2" />
                          Customer Information
                        </h6>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-2">
                              <strong>Name:</strong> {selectedOrder.customer.name}
                            </p>
                            <p className="mb-2 d-flex align-items-center">
                              <BsTelephone className="me-2 text-muted" size={14} />
                              <strong>Phone:</strong> 
                              <a href={`tel:${selectedOrder.customer.phone}`} className="ms-2 text-decoration-none">
                                {selectedOrder.customer.phone}
                              </a>
                            </p>
                            {selectedOrder.customer.email && (
                              <p className="mb-2 d-flex align-items-center">
                                <BsEnvelope className="me-2 text-muted" size={14} />
                                <strong>Email:</strong>
                                <a href={`mailto:${selectedOrder.customer.email}`} className="ms-2 text-decoration-none">
                                  {selectedOrder.customer.email}
                                </a>
                              </p>
                            )}
                          </div>
                          <div className="col-md-6">
                            <p className="mb-2 d-flex align-items-center">
                              <BsCalendar className="me-2 text-muted" size={14} />
                              <strong>Order Date:</strong> {formatDate(selectedOrder.created_at)}
                            </p>
                            {selectedOrder.source && (
                              <p className="mb-2">
                                <strong>Source:</strong> 
                                <span className="badge bg-light text-dark ms-2">{selectedOrder.source}</span>
                              </p>
                            )}
                            <p className="mb-0">
                              <strong>Last Updated:</strong> {formatDate(selectedOrder.updated_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fulfillment Details */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold d-flex align-items-center">
                          {selectedOrder.fulfillment_method === 'delivery' ? (
                            <><BsTruck className="me-2" /> Delivery Information</>
                          ) : (
                            <><BsShop className="me-2" /> Pickup Information</>
                          )}
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          {getFulfillmentBadge(selectedOrder.fulfillment_method)}
                        </div>
                        
                        {selectedOrder.fulfillment_method === 'delivery' ? (
                          <div>
                            {(selectedOrder.delivery_street || selectedOrder.delivery_city) && (
                              <p className="mb-2 d-flex align-items-start">
                                <BsGeoAlt className="me-2 mt-1 text-muted" size={14} />
                                <span>
                                  <strong>Address:</strong><br />
                                  {selectedOrder.delivery_street && (
                                    <>{selectedOrder.delivery_street}<br /></>
                                  )}
                                  {selectedOrder.delivery_city}
                                </span>
                              </p>
                            )}
                            {selectedOrder.delivery_notes && (
                              <p className="mb-0">
                                <strong>Delivery Notes:</strong><br />
                                <span className="text-muted">{selectedOrder.delivery_notes}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="mb-2">
                              <strong>Pickup Location:</strong> GHHomegoods Store
                            </p>
                            {selectedOrder.pickup_notes && (
                              <p className="mb-0">
                                <strong>Pickup Notes:</strong><br />
                                <span className="text-muted">{selectedOrder.pickup_notes}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="card shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold d-flex align-items-center">
                          <BsBoxSeam className="me-2" />
                          Order Items ({selectedOrder.item_count})
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-sm mb-0">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th className="text-center">Qty</th>
                                <th className="text-end">Price</th>
                                <th className="text-end">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.items?.map((item, index) => (
                                <tr key={index}>
                                  <td className="fw-semibold">{item.name}</td>
                                  <td className="text-center">{item.quantity}</td>
                                  <td className="text-end">{formatPrice(item.price)}</td>
                                  <td className="text-end fw-semibold">{formatPrice(item.subtotal)}</td>
                                </tr>
                              )) || (
                                <tr>
                                  <td colSpan="4" className="text-muted text-center">No items found</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Actions & Summary */}
                  <div className="col-lg-4">
                    {/* Order Actions */}
                    <div className="card shadow-sm mb-4">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold">Quick Actions</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-grid gap-2">
                          {selectedOrder.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                  updateOrderStatus(selectedOrder.id, 'confirmed');
                                  setSelectedOrder(prev => ({ ...prev, status: 'confirmed' }));
                                }}
                              >
                                <BsCheck className="me-1" /> Confirm Order
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this order?')) {
                                    updateOrderStatus(selectedOrder.id, 'cancelled');
                                    setSelectedOrder(prev => ({ ...prev, status: 'cancelled' }));
                                  }
                                }}
                              >
                                <BsX className="me-1" /> Cancel Order
                              </button>
                            </>
                          )}
                          
                          {selectedOrder.status === 'confirmed' && (
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                updateOrderStatus(selectedOrder.id, 'completed');
                                setSelectedOrder(prev => ({ ...prev, status: 'completed' }));
                              }}
                            >
                              <BsCheck className="me-1" /> Mark as Complete
                            </button>
                          )}
                          
                          <hr />
                          
                          <button className="btn btn-outline-primary btn-sm">
                            <BsTelephone className="me-1" /> Call Customer
                          </button>
                          
                          {selectedOrder.customer.email && (
                            <button className="btn btn-outline-secondary btn-sm">
                              <BsEnvelope className="me-1" /> Email Customer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="card shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-semibold d-flex align-items-center">
                          <BsCurrencyDollar className="me-2" />
                          Order Summary
                        </h6>
                      </div>
                      <div className="card-body">
                        {selectedOrder.items && selectedOrder.items.length > 0 && (
                          <>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Subtotal:</span>
                              <span>
                                {formatPrice(
                                  selectedOrder.items.reduce((sum, item) => sum + item.subtotal, 0)
                                )}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>
                                {selectedOrder.fulfillment_method === 'delivery' ? 'Delivery:' : 'Pickup:'}
                              </span>
                              <span>{formatPrice(0)}</span>
                            </div>
                            <hr />
                          </>
                        )}
                        
                        <div className="d-flex justify-content-between fw-bold fs-5">
                          <span>Total:</span>
                          <span className="text-primary">{formatPrice(selectedOrder.total_amount)}</span>
                        </div>
                        
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-muted">
                            <div className="mb-1">
                              <strong>Payment Status:</strong> 
                              <span className={`ms-1 ${selectedOrder.payment_status === 'paid' ? 'text-success' : 'text-warning'}`}>
                                {selectedOrder.payment_status || 'Pending'}
                              </span>
                            </div>
                            {selectedOrder.payment_method && (
                              <div>
                                <strong>Payment Method:</strong> 
                                <span className="ms-1">{selectedOrder.payment_method}</span>
                              </div>
                            )}
                          </small>
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
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <BsDownload className="me-1" />
                  Export Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}