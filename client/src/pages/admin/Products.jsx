// client/src/pages/admin/Products.jsx
import React, { useState, useEffect } from "react";
// import AddProductModal from "../../components/Modals/AddProductModal";
import {
  BsPlus,
  BsSearch,
  BsThreeDotsVertical,
  BsPencilSquare,
  BsTrash,
  BsEye,
  BsFilter,
  BsDownload,
  BsUpload,
  BsGrid,
  BsList,
  BsArrowUpRight,
  BsArrowDownRight,
  BsExclamationTriangle,
  BsCheckCircle,
} from "react-icons/bs";

export default function Products() {
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for development - replace with API calls later
  const mockProducts = [
    {
      id: 1,
      name: "Premium Ceramic Dinner Set",
      description: "Beautiful 16-piece ceramic dinner set perfect for family meals",
      price: 129.99,
      stock: 15,
      category_id: 1,
      category_name: "Kitchen & Dining",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      status: "active",
      created_at: "2025-01-15T10:30:00Z",
      sku: "KD001",
      featured: true,
    },
    {
      id: 2,
      name: "Luxury Bath Towel Set",
      description: "Ultra-soft 6-piece bath towel set in premium cotton",
      price: 79.99,
      stock: 8,
      category_id: 2,
      category_name: "Home & Living",
      image: "https://images.unsplash.com/photo-1584374456050-b1b5c4a4e0b1?w=100&h=100&fit=crop",
      status: "active",
      created_at: "2025-01-14T15:20:00Z",
      sku: "HL002",
      featured: false,
    },
    {
      id: 3,
      name: "Smart LED Table Lamp",
      description: "Voice-controlled LED lamp with adjustable brightness",
      price: 49.99,
      stock: 0,
      category_id: 3,
      category_name: "Electronics",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      status: "out_of_stock",
      created_at: "2025-01-13T09:15:00Z",
      sku: "EL003",
      featured: true,
    },
    {
      id: 4,
      name: "Outdoor Garden Planters",
      description: "Set of 3 weather-resistant ceramic planters for outdoor use",
      price: 89.99,
      stock: 25,
      category_id: 4,
      category_name: "Garden & Outdoor",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop",
      status: "active",
      created_at: "2025-01-12T14:45:00Z",
      sku: "GO004",
      featured: false,
    },
    {
      id: 5,
      name: "Professional Kitchen Knives",
      description: "High-carbon steel knife set with wooden block",
      price: 199.99,
      stock: 3,
      category_id: 1,
      category_name: "Kitchen & Dining",
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=100&h=100&fit=crop",
      status: "low_stock",
      created_at: "2025-01-11T11:30:00Z",
      sku: "KD005",
      featured: true,
    },
  ];

  const mockCategories = [
    { id: 1, name: "Kitchen & Dining" },
    { id: 2, name: "Home & Living" },
    { id: 3, name: "Electronics" },
    { id: 4, name: "Garden & Outdoor" },
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform data to match component expectations
      const transformedProducts = data.map(product => ({
        ...product,
        category_name: product.category?.name || 'Unknown Category',
        image: product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        status: product.status || 'active',
        featured: product.featured || false,
        created_at: product.created_at || new Date().toISOString()
      }));
      
      setProducts(transformedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           product.category_id.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.price - b.price;
      case "stock":
        return a.stock - b.stock;
      case "created_at":
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return (
        <span className="badge bg-danger">
          <BsExclamationTriangle className="me-1" />
          Out of Stock
        </span>
      );
    } else if (stock <= 5) {
      return (
        <span className="badge bg-warning">
          <BsExclamationTriangle className="me-1" />
          Low Stock
        </span>
      );
    } else {
      return (
        <span className="badge bg-success">
          <BsCheckCircle className="me-1" />
          In Stock
        </span>
      );
    }
  };

  const formatPrice = (price) => `GH₵${price.toFixed(2)}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedProducts);
    // TODO: Implement bulk actions
  };

  // Handle new product added
  const handleProductAdded = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    console.log('New product added:', newProduct);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <BsExclamationTriangle className="me-2" />
        {error}
        <button className="btn btn-outline-danger ms-auto" onClick={fetchProducts}>
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
          <h1 className="fw-bold mb-1">Products</h1>
          <p className="text-muted mb-0">Manage your product catalog</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary">
            <BsDownload className="me-1" />
            Export
          </button>
          <button className="btn btn-outline-secondary">
            <BsUpload className="me-1" />
            Import
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddProduct(true)}>
            <BsPlus className="me-1" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-primary bg-opacity-10 rounded">
                  <BsGrid className="text-primary" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Total Products</p>
                  <h4 className="mb-0">{products.length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-success bg-opacity-10 rounded">
                  <BsArrowUpRight className="text-success" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">In Stock</p>
                  <h4 className="mb-0">{products.filter(p => p.stock > 5).length}</h4>
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
                  <BsExclamationTriangle className="text-warning" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Low Stock</p>
                  <h4 className="mb-0">{products.filter(p => p.stock > 0 && p.stock <= 5).length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3 p-3 bg-danger bg-opacity-10 rounded">
                  <BsArrowDownRight className="text-danger" />
                </div>
                <div>
                  <p className="mb-1 text-muted small">Out of Stock</p>
                  <h4 className="mb-0">{products.filter(p => p.stock === 0).length}</h4>
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
                  placeholder="Search products, SKUs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="created_at">Sort by Date</option>
              </select>
            </div>
            <div className="col-md-2">
              <div className="btn-group" role="group">
                <button
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('table')}
                >
                  <BsList />
                </button>
                <button
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <BsGrid />
                </button>
              </div>
            </div>
            <div className="col-md-2">
              {selectedProducts.length > 0 && (
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    Actions ({selectedProducts.length})
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={() => handleBulkAction('delete')}>Delete Selected</button></li>
                    <li><button className="dropdown-item" onClick={() => handleBulkAction('feature')}>Mark as Featured</button></li>
                    <li><button className="dropdown-item" onClick={() => handleBulkAction('export')}>Export Selected</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table/Grid */}
      {viewMode === 'table' ? (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                onChange={handleSelectAll}
              />
              <span className="fw-semibold">
                Products ({filteredProducts.length})
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
                      checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th width="100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold">{product.name}</div>
                          <div className="text-muted small">{product.description.substring(0, 50)}...</div>
                          {product.featured && (
                            <span className="badge bg-info text-dark ms-1">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-monospace">{product.sku}</td>
                    <td>{product.category_name}</td>
                    <td className="fw-semibold">{formatPrice(product.price)}</td>
                    <td>
                      <span className={`fw-semibold ${product.stock <= 5 ? 'text-danger' : product.stock <= 10 ? 'text-warning' : 'text-success'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{getStatusBadge(product.status, product.stock)}</td>
                    <td className="text-muted">{formatDate(product.created_at)}</td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                          <BsThreeDotsVertical />
                        </button>
                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item"><BsEye className="me-1" /> View</button></li>
                          <li><button className="dropdown-item"><BsPencilSquare className="me-1" /> Edit</button></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><button className="dropdown-item text-danger"><BsTrash className="me-1" /> Delete</button></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="row">
          {paginatedProducts.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleProductSelect(product.id)}
                    />
                  </div>
                  {product.featured && (
                    <div className="position-absolute top-0 start-0 p-2">
                      <span className="badge bg-info text-dark">Featured</span>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="card-text text-muted small">{product.description.substring(0, 80)}...</p>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-primary">{formatPrice(product.price)}</span>
                    {getStatusBadge(product.status, product.stock)}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Stock: {product.stock}</small>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary"><BsEye /></button>
                      <button className="btn btn-outline-secondary"><BsPencilSquare /></button>
                      <button className="btn btn-outline-danger"><BsTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
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
              {[...Array(totalPages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
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

      {/* Add Product Modal - Commented out for now */}
      {/* <AddProductModal 
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onProductAdded={handleProductAdded}
        categories={categories}
      /> */}
    </div>
  );
}