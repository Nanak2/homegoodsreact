import React, { useState, useEffect } from 'react';

export default function Shop({ cartItems, setCartItems }) {
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/products');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        //console.log("Response:", data);
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleCategoryClick = async (categorySlug) => {
    setActiveCategory(categorySlug);
    if (categorySlug === 'all') {
      setCategoryId(null);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5001/api/products/${categorySlug}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCategoryId(data.length > 0 ? data[0].id : null);
      //console.log("Return data:", data.map(category => category.id));
      //console.log("Return category ID:", data[0].id);
    } catch (err) {
      console.error('Fetch category error:', err);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !categoryId || product.category_id === categoryId;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId, productName, productPrice, productImage, productStock) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { 
          id: productId, 
          name: productName, 
          price: productPrice, 
          image: productImage, 
          stock: productStock,
          quantity: 1 }];
      }
    });
    // Cart drawer does NOT open automatically
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div id="shop-page" className='shop-page'>
      <h2 className="section-title" style={{ margin: '2.0rem' }}>All Products</h2>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-filters">
            {['all', 'Baby Care', 'Food & Beverages', 'Cleaning & Household', 'Personal Care'].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
          >
                {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div
                key={product.id}
                className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                style={{
                  minHeight: "auto" // allow the card to shrink naturally
                }}
              >
                {product.image_url && (
                  <div
                    className="d-flex align-items-center mt-2 justify-content-center"
                    style={{
                      width: "100%",
                      height: "140px", // reduced image height
                      background: "#fff",
                      position: "relative"
                    }}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="img-fluid"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain"
                      }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}
                <div className="product-info p-3">
                  <h4
                    className="product-name font-bold"
                    style={{ fontSize: "1rem", marginBottom: "0.25rem" }} // smaller text
                  >
                    {product.name}
                  </h4>
                  <p
                    className="text-gray-600 text-sm mb-2 line-clamp-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {product.description}
                  </p>
                  <span
                    className="fw-bold mb-2"
                    style={{
                      fontSize: "1.1rem",
                      color: "#ea580c",
                      display: "block"
                    }}
                  >
                    GH₵{product.price}
                  </span>
                  <button
                    onClick={() =>
                      addToCart(product.id, product.name, product.price, product.image_url, product.stock)
                    }
                    className={`btn rounded px-3 py-1 ${isOutOfStock ? "disabled opacity-50" : ""}`}
                    disabled={isOutOfStock}
                    style={{
                      backgroundColor: "#f97316",
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-products">
            {searchTerm || activeCategory !== "all"
              ? "No products match your search criteria."
              : "No products available."}
          </div>
        )}
      </div>
    </div>
  );
}
