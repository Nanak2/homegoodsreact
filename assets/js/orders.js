function proceedToCheckout() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'warning');
                return;
            }
            
            closeCart();
            showCheckoutModal();
        }
        function showCheckoutModal() {
            const checkoutModal = document.getElementById('checkoutModal');
            const checkoutBody = document.getElementById('checkoutBody');
            
            const total = getCartTotal();
            const itemCount = getCartItemCount();
            
            const orderSummaryHTML = cart.map(item => `
                <div class="order-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            checkoutBody.innerHTML = `
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
                            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #6b7280;">Free delivery in Greater Accra for orders over GH₵200</p>
                        </div>
                        <div class="fulfillment-option" onclick="selectFulfillment('pickup')">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏪</div>
                            <strong>Pickup</strong>
                            <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #6b7280;">Pickup from our Airport location</p>
                        </div>
                    </div>
                </div>
                
                <div class="checkout-section">
                    <h3>👤 Customer Information</h3>
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-input required" id="customerName" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" class="form-input required" id="customerPhone" placeholder="0XX XXX XXXX" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email (Optional)</label>
                        <input type="email" class="form-input" id="customerEmail" placeholder="your.email@example.com">
                    </div>
                </div>
                
                <div class="checkout-section" id="deliverySection">
                    <h3>📍 Delivery Information</h3>
                    <div class="form-group">
                        <label class="form-label">Delivery Address *</label>
                        <input type="text" class="form-input required" id="deliveryAddress" placeholder="House number, street, area" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">City/Town *</label>
                        <input type="text" class="form-input required" id="deliveryCity" placeholder="e.g., Accra" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Delivery Notes (Optional)</label>
                        <input type="text" class="form-input" id="deliveryNotes" placeholder="Landmark, special instructions, etc.">
                    </div>
                </div>
                
                <div class="checkout-section hidden" id="pickupSection">
                    <h3>🏪 Pickup Information</h3>
                    <div class="form-group">
                        <label class="form-label">Preferred Pickup Time *</label>
                        <select class="form-input" id="pickupTime">
                            <option value="">Select pickup time</option>
                            <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                            <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                            <option value="evening">Evening (4:00 PM - 7:00 PM)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pickup Notes (Optional)</label>
                        <input type="text" class="form-input" id="pickupNotes" placeholder="Any special instructions">
                    </div>
                    <div style="background: #e0f2fe; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <p style="margin: 0; font-size: 0.875rem; color: #0277bd;">
                            📍 <strong>Pickup Location:</strong> Airport, Accra<br>
                            🕒 <strong>Hours:</strong> Monday - Saturday: 8:00 AM - 7:00 PM
                        </p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="button-secondary" onclick="closeCheckout()" style="flex: 1;">
                        ← Back to Cart
                    </button>
                    <button class="button" onclick="placeOrder()" style="flex: 2;">
                        <span id="placeOrderText">Place Order</span>
                        <span class="loading-spinner hidden" id="placeOrderSpinner"></span>
                    </button>
                </div>
            `;
            
            checkoutModal.style.display = 'flex';
        }
        function selectFulfillment(method) {
            document.querySelectorAll('.fulfillment-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            event.target.closest('.fulfillment-option').classList.add('selected');
            
            const deliverySection = document.getElementById('deliverySection');
            const pickupSection = document.getElementById('pickupSection');
            
            if (method === 'delivery') {
                deliverySection.classList.remove('hidden');
                pickupSection.classList.add('hidden');
            } else {
                deliverySection.classList.add('hidden');
                pickupSection.classList.remove('hidden');
            }
        }