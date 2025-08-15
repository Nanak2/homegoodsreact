// Checkout.jsx
import React, { useState, useEffect } from 'react';
import CustomInput from '../ui/Input.jsx';
import CustomTextarea from '../ui/textArea.jsx'

export default function Checkout({ cartItems = [], onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [selected, setSelected] = useState("delivery");

  const selectFulfillment = (method) => {
    setSelected(method);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = selected === 'delivery' ? 10 : 0;
  const total = subtotal + deliveryFee;

  // Check if all required fields are filled
  const isFormValid = () => {
    const basicFieldsValid = customerName.trim() !== '' && customerPhone.trim() !== '';

    if (selected === 'delivery') {
        return basicFieldsValid && deliveryStreet.trim() !== '' && deliveryCity.trim() !== '';
    }

    if (selected === 'pickup') {
        return basicFieldsValid;
    }

    return false;
  };

  const isButtonDisabled = !isFormValid() || cartItems.length === 0;

  const handleSubmit = (e) => {
  e.preventDefault();

  // Simple validation
  if (!customerName || !customerPhone) {
    alert('Please provide your name and phone number.');
    return;
  }
  if (selected === 'delivery' && (!deliveryStreet || !deliveryCity)) { // Fixed: use 'selected' instead of 'fulfillmentMethod'
    alert('Please provide your delivery address.');
    return;
  }

  const orderData = {
    cartItems,
    customerName,
    customerPhone,
    customerEmail,
    fulfillmentMethod: selected, // Fixed: use 'selected'
    deliveryStreet,
    deliveryCity,
    specialInstructions,
    total,
  };

  console.log('Placing order:', orderData);
    alert('Order placed successfully!');
    onClose();
  };

  return (
    <div 
      className="checkout-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
        <div 
            className="checkout-content"
            style={{
            width: '400px',
            maxHeight: '90%',
            overflowY: 'auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '1rem',
            position: 'relative',
            }}
        >
            <div
                className="checkout-header border-bottom"
                style={{
                    backgroundColor: "#f8f9fa",
                    padding: "1rem",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    className="btn btn-outline-danger btn-sm"
                    style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        padding: "0.375rem 0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #dee2e6",
                        color: "#dc3545",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8d7da')} // matches text-danger // bg-warning
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}  // bg-danger
                    aria-label="Close checkout"
                >
                    Close
                </button>
                <h2 style={{ fontSize: '2.5rem', marginLeft: '2.5rem' }}>📋 Checkout</h2>
            </div>

            <form onSubmit={handleSubmit} >
                <div className='checkout-section mt-3'>
                    {/* Fulfillment */}
                    <h3 style={{ fontSize: "1.5rem", }}>🚚 Fulfillment Method</h3>
                    <div className="fulfillment-options" style={{ display: "flex", gap: "1rem" }}>
                        <div
                        className={`fulfillment-option ${selected === "delivery" ? "selected" : ""}`}
                        onClick={() => selectFulfillment("delivery")}
                        style={{
                            flex: 1,
                            border: selected === "delivery" ? "2px solid #f97316" : "1px solid #d1d5db",
                            borderRadius: "8px",
                            padding: "1rem",
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: selected === "delivery" ? "#fff7ed" : "#fff",
                            transition: "0.2s ease",
                        }}
                    >
                        {/* Delivery Option */}
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚚</div>
                            <strong>Delivery</strong>
                            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
                                Free delivery in Greater Accra for orders over GH₵2000
                                {total >= 2000 && (
                                <br />
                                )}
                                {total >= 2000 && (
                                <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                                    ✅ Free delivery qualified!
                                </span>
                                )}
                            </p>
                        </div>

                        {/* Pickup Option */}
                        <div
                            className={`fulfillment-option ${selected === "pickup" ? "selected" : ""}`}
                            onClick={() => selectFulfillment("pickup")}
                            style={{
                                flex: 1,
                                border: selected === "pickup" ? "2px solid #f97316" : "1px solid #d1d5db",
                                borderRadius: "8px",
                                padding: "1rem",
                                textAlign: "center",
                                cursor: "pointer",
                                backgroundColor: selected === "pickup" ? "#fff7ed" : "#fff",
                                transition: "0.2s ease",
                            }}
                        >
                            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏪</div>
                            <strong>Pickup</strong>
                            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
                                Pickup from our Airport location
                                <br />
                                <span style={{ color: "#16a34a", fontWeight: "bold" }}>Always free!</span>
                            </p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="form-section mt-4">
                        <h3 className="mb-2 fw-bold" style={{ fontSize: "1.5rem", }}>
                            👤 Customer Information
                        </h3>
                        <div className="p-3 border rounded shadow-sm" style={{ backgroundColor: "#fff" }}>
                            {/* Full Name */}
                            <div className="mb-3">
                                <CustomInput
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="mb-3">
                                <CustomInput
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <CustomInput
                                    label="Email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                />
                            </div>

                            {/* Delivery Address */}
                            {selected === 'delivery' && (
                                <>
                                    <div className="mb-3">
                                        <CustomInput
                                            label="Street Address"
                                            placeholder="e.g., 15 Independence Avenue"
                                            value={deliveryStreet}
                                            onChange={(e) => setDeliveryStreet(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <CustomInput
                                            label="City/Town"
                                            placeholder="e.g., Accra"
                                            value={deliveryCity}
                                            onChange={(e) => setDeliveryCity(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <h3 className='mt-4 mb-2' style={{ fontSize: "1.5rem", }}>📦 Order Summary</h3>
                    <div className="order-summary">
                        {cartItems.length === 0 ? (
                        <p>No items in cart.</p>
                        ) : (
                        cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>GH₵{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))
                        )}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subtotal:</span>
                            <span>GH₵{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Delivery:</span>
                            <span>GH₵{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <span>GH₵{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Special Instructions */}
                <div className="form-section">
                    <CustomTextarea
                        label="Special Instructions"
                        placeholder="Any special instructions (optional)..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                    />
                </div>

                {/* Submit */}
                <div className="form-section">
                    <button 
                        type="submit" 
                        className="button" 
                        disabled={isButtonDisabled}
                        style={{ 
                        width: '100%',
                        backgroundColor: isButtonDisabled ? '#d1d5db' : '#f97316',
                        color: isButtonDisabled ? '#9ca3af' : '#fff',
                        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                        opacity: isButtonDisabled ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                        }}
                    >
                        Place Order
                    </button>
                </div>
            </form>
      </div>
    </div>
  );
}
