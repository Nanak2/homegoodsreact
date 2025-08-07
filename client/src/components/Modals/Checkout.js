// Checkout.js
import React from 'react';

export default function Checkout() {
    return (
        <div id="checkoutModal" class="checkout-modal" style="display: none;">
            <div class="checkout-content">
                <div class="checkout-header">
                    <h2>📋 Checkout</h2>
                    <button class="close-cart" onclick="closeCheckout()">&times;</button>
                </div>
                <div class="checkout-body" id="checkoutBody">
                    <form id="checkoutForm" onsubmit="event.preventDefault(); placeOrder();">
                        {/* Error container */}
                        <div id="checkoutErrors" class="hidden mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            {/* Validation errors will appear here */}
                        </div>
                        
                        {/* Customer Information */}
                        <div class="form-section">
                            <h3>Customer Information</h3>
                            <div class="form-group">
                                <label class="form-label" for="customerName">Full Name *</label>
                                <input type="text" id="customerName" name="customerName" class="form-input" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="customerPhone">Phone Number *</label>
                                <input type="tel" id="customerPhone" name="customerPhone" class="form-input" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="customerEmail">Email (Optional)</label>
                                <input type="email" id="customerEmail" name="customerEmail" class="form-input" />
                            </div>
                        </div>

                        {/* Fulfillment Method */}
                        <div class="form-section">
                            <h3>Fulfillment Method</h3>
                            <div class="fulfillment-options">
                                <label class="fulfillment-option">
                                    <input type="radio" name="fulfillmentMethod" value="pickup" checked />
                                    <div class="option-content">
                                        <strong>Store Pickup - FREE</strong>
                                        <p>Pick up from our store (Same day)</p>
                                    </div>
                                </label>
                                <label class="fulfillment-option">
                                    <input type="radio" name="fulfillmentMethod" value="delivery" />
                                    <div class="option-content">
                                        <strong>Home Delivery - GH₵10</strong>
                                        <p>Delivery to your address (1-2 business days)</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Delivery Address (shown only for delivery) */}
                        <div id="deliveryAddressSection" class="form-section hidden">
                            <h3>Delivery Address</h3>
                            <div class="form-group">
                                <label class="form-label" for="deliveryAddress">Full Address *</label>
                                <textarea id="deliveryAddress" name="deliveryAddress" class="form-input" rows="3" placeholder="Enter your complete delivery address"></textarea>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div class="form-section">
                            <h3>Special Instructions (Optional)</h3>
                            <div class="form-group">
                                <textarea id="specialInstructions" name="specialInstructions" class="form-input" rows="2" placeholder="Any special delivery instructions..."></textarea>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div class="form-section">
                            <h3>Order Summary</h3>
                            <div class="order-summary">
                                <div id="orderItems">
                                    {/* Order items will be populated here */}
                                </div>
                                <div class="order-totals">
                                    <div class="total-line">
                                        <span>Subtotal:</span>
                                        <span id="orderSubtotal">GH₵0.00</span>
                                    </div>
                                    <div class="total-line">
                                        <span>Delivery:</span>
                                        <span id="orderDelivery">GH₵0.00</span>
                                    </div>
                                    <div class="total-line total-final">
                                        <span><strong>Total:</strong></span>
                                        <span id="orderTotal"><strong>GH₵0.00</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*} Submit Button */}
                        <div class="form-section">
                            <button type="submit" id="submitOrder" class="button" style="width: 100%;">
                                <span id="orderLoadingSpinner" class="loading-spinner hidden"></span>
                                Place Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>  
    );
};