// Home.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  // Temporary handlers — replace these with real React logic later
  const showShop = (category) => {
    console.log("Show shop for:", category || "all");
  };
  const testConnection = () => console.log("Test Connection clicked");
  const testProxyHealth = () => console.log("Test Proxy Health clicked");
  const showTracking = () => console.log("Show Tracking clicked");
  const clearAllData = () => console.log("Clear all data clicked");

  return (
    <main className="main">
      <Helmet>
        <title>Home | Ghhomegoods</title>
        <meta
          name="description"
          content="Buy quality household goods at wholesale prices."
        />
      </Helmet>

      <div id="homePage">
        {/* Hero Section */}
        <div className="hero">
          <h1>Welcome to Ghhomegoods</h1>
          <p>
            Your trusted source for baby care, household essentials, food & beverages, and
            personal care products. Quality brands at wholesale prices delivered to your door.
          </p>
          <button className="button" onClick={() => showShop()}>
            Shop Now
          </button>
        </div>

        {/* Categories */}
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          <div className="category-card" onClick={() => showShop('baby-care')}>
            <span className="category-icon">👶</span>
            <h3>Baby Care</h3>
            <p>Browse our baby care products</p>
          </div>
          <div className="category-card" onClick={() => showShop('food-beverages')}>
            <span className="category-icon">🍎</span>
            <h3>Food & Beverages</h3>
            <p>Browse our food & beverages products</p>
          </div>
          <div className="category-card" onClick={() => showShop('cleaning-household')}>
            <span className="category-icon">🧽</span>
            <h3>Cleaning & Household</h3>
            <p>Browse our cleaning & household products</p>
          </div>
          <div className="category-card" onClick={() => showShop('personal-care')}>
            <span className="category-icon">🧴</span>
            <h3>Personal Care</h3>
            <p>Browse our personal care products</p>
          </div>
          <div className="category-card" onClick={() => showShop('storage-organization')}>
            <span className="category-icon">📦</span>
            <h3>Storage & Organization</h3>
            <p>Browse our storage & organization products</p>
          </div>
          <div className="category-card" onClick={() => showShop('back-to-school')}>
            <span className="category-icon">🎒</span>
            <h3>Back to School</h3>
            <p>Browse our back to school products</p>
          </div>
        </div>

        {/* Featured Products */}
        <h2 className="section-title">Featured Products</h2>
        <div className="product-grid" id="featuredProducts">
          {/* Featured products will be loaded here */}
        </div>

        {/* System Testing Section */}
        <div
          style={{
            textAlign: 'center',
            margin: '3rem 0',
            padding: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>🔧 System Testing</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="button-secondary" onClick={testConnection}>
              🔧 Test Connection
            </button>
            <button className="button-secondary" onClick={testProxyHealth}>
              🏥 Test Proxy Health
            </button>
            <button className="button-secondary" onClick={showTracking}>
              📦 Track My Order
            </button>
          </div>
        </div>

        {/* Customer Actions */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button
            className="button-secondary"
            onClick={clearAllData}
            style={{ background: '#dc2626', color: 'white', borderColor: '#dc2626' }}
          >
            🧹 Clear All Data
          </button>
        </div>
      </div>
    </main>
  );
}
