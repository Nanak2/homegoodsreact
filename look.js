function populateBasicCheckoutForm() {
    const checkoutBody = document.getElementById('checkoutBody');
    if (!checkoutBody) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const orderSummaryHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutBody.innerHTML = `
        <form id="checkoutForm">
            <div class="checkout-section">
                <h3>📦 Order Summary</h3>
                <div class="order-summary">
                    ${orderSummaryHTML}
                    <div class="order-item total-row">
                        <span><strong>Total (${itemCount} items)</strong></span>
                        <span><strong>GH₵ ${total.toFixed(2)}</strong></span>
                    </div>
                </div>
            </div>
            
            <!-- BASIC CUSTOMER INFO -->
            <div class="checkout-section">
                <h3>📝 Customer Information</h3>
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" name="customerName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" name="customerPhone" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email (Optional)</label>
                    <input type="email" name="customerEmail" class="form-input">
                </div>
            </div>
            
            <!-- BASIC FULFILLMENT -->
            <div class="checkout-section">
                <h3>🚚 Delivery Information</h3>
                <div class="form-group">
                    <label class="form-label">Delivery Address *</label>
                    <textarea name="deliveryAddress" class="form-input" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Special Instructions</label>
                    <textarea name="specialInstructions" class="form-input" rows="2"></textarea>
                </div>
            </div>
            
            <!-- PLACE ORDER BUTTON -->
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="button" class="button-secondary" onclick="closeCheckout()" style="flex: 1;">
                    ← Back to Cart
                </button>
                <button type="button" class="button" onclick="placeOrder()" style="flex: 2;">
                    Place Order
                </button>
            </div>
        </form>
    `;
}


export function createEnhancedCheckoutForm() {
    const checkoutBody = document.getElementById('checkoutBody') || document.getElementById('checkoutModal');
    if (!checkoutBody) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const orderSummaryHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutBody.innerHTML = `
        <form id="checkoutForm">
            <div class="checkout-section">
                <h3>📦 Order Summary</h3>
                <div class="order-summary">
                    ${orderSummaryHTML}
                    <div class="order-item">
                        <span><strong>Total (${itemCount} items)</strong></span>
                        <span><strong>GH₵ ${total.toFixed(2)}</strong></span>
                    </div>
                </div>
            </div>
            
            <div class="checkout-section">
                <h3>🚚 Fulfillment Method</h3>
                <div class="fulfillment-options">
                    <div class="fulfillment-option selected" onclick="selectFulfillment('delivery')">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚚</div>
                        <strong>Delivery</strong>
                        <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #6b7280;">
                            Free delivery in Greater Accra for orders over GH₵2000
                            ${total >= 200 ? '<br><span style="color: #16a34a; font-weight: bold;">✅ Free delivery qualified!</span>' : ''}
                        </p>
                    </div>
                    <div class="fulfillment-option" onclick="selectFulfillment('pickup')">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏪</div>
                        <strong>Pickup</strong>
                        <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #6b7280;">
                            Pickup from our Airport location<br>
                            <span style="color: #16a34a; font-weight: bold;">Always free!</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="checkout-section">
                <h3>👤 Customer Information</h3>
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" name="customerName" class="form-input required" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" name="customerPhone" class="form-input required" placeholder="0XX XXX XXXX" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email (Optional)</label>
                    <input type="email" name="customerEmail" class="form-input" placeholder="your.email@example.com">
                </div>
            </div>
            
            <div class="checkout-section" id="deliverySection">
                <h3>📍 Delivery Information</h3>
                <div class="form-group">
                    <label class="form-label">Delivery Address *</label>
                    <input type="text" name="deliveryAddress" class="form-input required" placeholder="House number, street, area" required>
                </div>
                <div class="form-group">
                    <label class="form-label">City/Town *</label>
                    <input type="text" name="deliveryCity" class="form-input required" placeholder="e.g., Accra" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Delivery Notes (Optional)</label>
                    <textarea name="specialInstructions" class="form-input" placeholder="Landmark, special instructions, etc." rows="3"></textarea>
                </div>
            </div>
            
            <!-- ENHANCED PICKUP SECTION WITH TIME SLOTS -->
            <div class="checkout-section hidden" id="pickupSection">
                <h3>🏪 Pickup Information</h3>
                
                <div class="pickup-location-info">
                    <div style="background: #e0f2fe; border: 1px solid #0284c7; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                        <h4 style="color: #0369a1; margin: 0 0 1rem 0;">📍 Pickup Location</h4>
                        <div style="color: #0369a1; line-height: 1.6;">
                            <strong>${STORE_INFO.name}</strong><br>
                            📍 ${STORE_INFO.address}<br>
                            📞 ${STORE_INFO.phone}<br>
                            🕒 ${STORE_INFO.hours}
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Preferred Pickup Time Slot *</label>
                    <div class="pickup-time-slots">
                        ${Object.entries(PICKUP_TIME_SLOTS).map(([value, slot]) => `
                            <div class="pickup-time-option" data-time="${value}" onclick="selectPickupTime('${value}')">
                                <div class="pickup-time-icon">${slot.icon}</div>
                                <div class="pickup-time-details">
                                    <div class="pickup-time-label">${slot.label}</div>
                                    <div class="pickup-time-description">${slot.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <input type="hidden" name="pickupTime" id="selectedPickupTime">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Pickup Notes (Optional)</label>
                    <textarea name="specialInstructions" class="form-input" placeholder="Any special instructions for pickup" rows="3"></textarea>
                </div>
                
                <div class="pickup-benefits">
                    <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <h4 style="color: #166534; margin: 0 0 0.5rem 0;">✅ Pickup Benefits</h4>
                        <ul style="color: #166534; margin: 0; padding-left: 1.5rem; font-size: 0.875rem;">
                            <li>Always free - no delivery charges</li>
                            <li>Faster - ready within 2-4 hours after payment</li>
                            <li>Inspect items before taking them</li>
                            <li>Personal service from our team</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="button" class="button-secondary" onclick="closeCheckoutModal()" style="flex: 1;">
                    ← Back to Cart
                </button>
                <button type="button" class="button" id="submitOrder" onclick="placeOrder()" style="flex: 2;">
                    <span id="placeOrderText">Place Order</span>
                    <span class="loading-spinner hidden" id="orderLoadingSpinner"></span>
                </button>
            </div>
        </form>
    `;
}