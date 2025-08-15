// Footer.jsx
import React from 'react';

export default function Footer() {
  const showAdminModal = () => {
    console.log("Show Admin Modal clicked");
    // Add your modal logic here
  };

  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h3>Ghhomegoods</h3>

        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
          Your trusted source for quality household essentials, baby care & personal care products
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#9ca3af' }}>
            📞 +233 59 961 3762 | 📧 ghhomegoods@gmail.com
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            🚚 Free delivery in Greater Accra for orders over GH₵2000
          </p>
        </div>

        <div className="payment-info">
          <p>💰 We accept MTN Mobile Money, Vodafone Cash & AirtelTigo Money</p>
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          © 2025 Ghhomegoods. All rights reserved. | Business Registration: Coming Soon
        </p>

        <button
          className="admin-access"
          id="adminAccessBtn"
          onClick={showAdminModal}
        >
          Admin Access
        </button>
      </div>
    </footer>
  );
}
