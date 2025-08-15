import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ cartItems, onCartClick }) {
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [showAdmin, setShowAdmin] = React.useState(false);
  const adminOrderCount = 0;

  const handleLogout = () => {
    setShowAdmin(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          <img src="assets/images/logo.png" alt="GHHomegoods Logo" className="logo-image" />
          <span className="logo-text">Ghhomegoods</span>
        </div>
        
        {/* Navigation */}
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <button className="nav-button active" onClick={() => navigate('/')}>
                Home
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => navigate('/shop')}>
                Shop
              </button>
            </li>
            <li>
              <button className={`nav-button ${showAdmin ? '' : 'hidden'}`} onClick={() => navigate('/admin')}>
                Admin (<span>{adminOrderCount}</span>)
              </button>
            </li>
            <li>
              <button
                className={`nav-button ${showAdmin ? '' : 'hidden'}`}
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.2)',
                  border: '1px solid rgba(220, 38, 38, 0.5)'
                }}
              >
                Logout
              </button>
            </li>
          </ul>

          {/* Cart Button */}
          <button className="cart-button" onClick={onCartClick}>
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">
                <span>{cartCount}</span>
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
