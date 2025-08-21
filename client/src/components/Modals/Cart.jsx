import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../../assets/js/cart';

export default function Cart({ cartItems = [], onClose, openCheckout, setCartItems }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const navigate = useNavigate();
 
  // Function to update the quantity of an item in the cart
  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
    alert('Cart cleared successfully!');
  };

  //console.log('item stock', cartItems.map(item => item.stock));

  return (
    <div
        id="cartModal"
        className="cart-modal"
        style={{
            position:  "absolute",
            top: 0,
            right: 0,
            width: '25%',
            maxWidth: "400px",
            height: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            overflowY: 'auto',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease-in-out',
        
        }}
    >
        {/* Cart Header */}
        <div 
            className="cart-header border-bottom flex-wrap"
            style={{
                backgroundColor: "#f8f9fa",
                padding: "1.0rem",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}
        >
            <button
                onClick={onClose}
                className="close-btn"
                style={{ marginRight: '4px', padding: '0.1' }}
                aria-label="Close cart"
            >
                Close
            </button>
            <div className="d-flex align-items-center justify-content-center gap-2" style={{ position: 'relative', top: '10px', }}>
                <i className="bi bi-cart3 fs-4" style={{ color: '#f97316' }}></i>
                <h5
                    className="mb-0 fw-bold"
                    style={{ fontSize: '2.0rem', }}
                >
                    Shopping Cart
                </h5>
            </div>
        </div>

        {/* Cart Content */}
        <div style={{ padding: '1rem' }}>
            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <button 
                    style={{ background: '#f97316', color: '#fff', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                    onClick={() => {
                        onClose();
                        navigate('/shop'); // Navigate to the shop page
                    }}
                >
                    Continue Shopping
                </button>
                </div>
            ) : (
                <div>
                    {cartItems.map(item => (
                    <div 
                        key={item.id} 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            borderBottom: '1px solid #e5e7eb',
                            gap: '1rem'
                        }}
                    >
                        {/* Image */}
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            style={{
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover', 
                            borderRadius: '6px'
                            }} 
                        />

                        {/* Info */}
                        <div style={{ flex: '1' }}>
                            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</h4>
                            <p style={{ margin: '0.25rem 0', color: '#f97316', fontWeight: 'bold' }}>
                            GH₵{item.price}
                            </p>
                            {item.stock <= 5 && (
                            <p style={{ color: 'red', fontSize: '0.85rem' }}>
                                Only {item.stock} left!
                            </p>
                            )}
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                                onClick={() =>
                                item.quantity === 1
                                    ? removeFromCart(item.id) // remove if quantity is 1
                                    : updateQuantity(item.id, item.quantity - 1) // decrement otherwise
                                }
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: '#e5e7eb',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                {item.quantity === 1 ? (
                                    <i className="bi bi-trash text-danger"></i> // trash icon
                                ) : (
                                    "−" // minus sign
                                )}
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: '#e5e7eb',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                                }}
                            >
                                +
                            </button>
                        </div>

                    </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            {cartItems.length > 0 && (
                <div style={{ 
                    marginTop: '1.5rem', 
                    borderTop: '1px solid #e5e7eb', 
                    paddingTop: '1rem' 
                    }}
                >
                    <strong style={{ display: 'block', marginBottom: '1rem' }}>
                        Total: GH₵{total.toFixed(2)}
                    </strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#f97316',
                            color: '#fff',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                            }}
                            onClick={openCheckout}
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            style={{
                            width: '100%',
                            padding: '0.4rem',
                            backgroundColor: '#f9fafb',
                            color: '#9ca3af',
                            border: '1px solid #f3f4f6',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 'normal'
                            }}
                            onClick={() => clearCart()}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.color = '#dc3545';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#f9fafb';
                                e.currentTarget.style.color = '#9ca3af';
                            }}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}