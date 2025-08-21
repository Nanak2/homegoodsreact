// Checkout.jsx
import React, { useState, useEffect } from 'react';
import CustomInput from '../ui/Input.jsx';
import CustomTextarea from '../ui/textArea.jsx'

export default function Checkout({ cartItems = [], onClose, setCartItems }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selected, setSelected] = useState("delivery");

  const selectFulfillment = (method) => {
    setSelected(method);
  };

  useEffect(() => {
    // lock background scroll
    document.body.style.overflow = "hidden";

    // cleanup when modal unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

  // Handle placing an order
  const handleSubmit = async (e) => {
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
      pickupNotes,
      deliveryNotes,
      total,
    };

    try {
      const response = await fetch("http://localhost:5001/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({orderData}),
      })

      const data = await response.json();
      console.log("Order placed response:", data);

      if (response.ok) {
        alert("Order placed successful");
        setCartItems([]);
        onClose();
      } else {
        alert(data.message || "Order placed failed");
      }

    } catch (err) {
      console.error("Order placed error:", err);
      alert("Network error. Please try again later");
    }
  }

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <div className="checkout-header border-bottom">
          <button onClick={onClose} className="close-btn" aria-label="Close checkout">
            Close
          </button>
          <h2>📋 Checkout</h2>
        </div>
        <form onSubmit={handleSubmit} >
          <div className='checkout-section mt-3'>
            {/* Fulfillment */}
            <h3 style={{ fontSize: "1.5rem", }}>🚚 Fulfillment Method</h3>
            <div className="fulfillment-options" style={{ display: "flex", gap: "1rem" }}>
              {/* Delivery Option */}
              <div className={`fulfillment-option ${selected === "delivery" ? "selected" : ""}`}
                onClick={() => selectFulfillment("delivery")}
              >
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
              <div className={`fulfillment-option ${selected === "pickup" ? "selected" : ""}`}
                onClick={() => selectFulfillment("pickup")}
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
                  <CustomInput label="Full Name" placeholder="Enter your full name"
                    value={customerName} onChange={(e) => setCustomerName(e.target.value)} required
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                  <CustomInput label="Phone Number" type="tel" placeholder="Enter your phone number" 
                    value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <CustomInput label="Email" type="email" placeholder="your.email@example.com"
                      value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                {/* Delivery Address */}
                {selected === 'delivery' && (
                  <>
                    <div className="mb-3">
                      <CustomInput label="Street Address" placeholder="e.g., 15 Independence Avenue"
                        value={deliveryStreet} onChange={(e) => setDeliveryStreet(e.target.value)} required
                      />
                    </div>
                    <div className="mb-3">
                      <CustomInput label="City/Town" placeholder="e.g., Accra" value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)} required
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
            {selected === "pickup" ? (
              <CustomTextarea label="Pickup Notes" placeholder="Any special pickup instructions (optional)..."
                value={pickupNotes} onChange={(e) => setPickupNotes(e.target.value)} rows={3}
              />
            ) : (
              <CustomTextarea label="Delivery Notes" placeholder="Any special delivery instructions (optional)..."
                value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} rows={3}
              />
            )}
          </div>

          {/* Submit */}
          <div className="form-section">
            <button type="submit" className="button-submit" disabled={isButtonDisabled}
              style={{ 
                backgroundColor: isButtonDisabled ? '#d1d5db' : '#f97316',
                color: isButtonDisabled ? '#9ca3af' : '#fff',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                opacity: isButtonDisabled ? 0.6 : 1
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
