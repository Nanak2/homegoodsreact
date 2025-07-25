// orders.js - Complete order management and checkout with ENHANCED PICKUP TIME SLOTS

import { 
    cart, 
    setCart, 
    orders, 
    setOrders, 
    incrementOrderCounter,
    showNotification,
    formatPrice,
    formatDate
} from './utils.js';

import { 
    VALIDATION_RULES, 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES,
    DELIVERY_OPTIONS,
    ORDER_STATUSES
} from './config.js';

import { callViaProxy, testProxyHealth } from './api.js';

// ADD THIS: Enhanced pickup time slots configuration (from working single file)
const PICKUP_TIME_SLOTS = {
    'morning': {
        label: 'Morning (9:00 AM - 12:00 PM)',
        description: 'Best for early pickups',
        icon: '🌅'
    },
    'afternoon': {
        label: 'Afternoon (12:00 PM - 4:00 PM)', 
        description: 'Most popular time slot',
        icon: '☀️'
    },
    'evening': {
        label: 'Evening (4:00 PM - 7:00 PM)',
        description: 'Perfect for after work',
        icon: '🌆'
    }
};

// ADD THIS: Store information for pickup
const STORE_INFO = {
    name: "GHHomegoods Store",
    phone: "+233 59 961 3762",
    address: "Airport, Accra",
    hours: "Monday - Saturday: 8:00 AM - 7:00 PM"
};

// ============================================================================
// ORDER PLACEMENT - ENHANCED WITH PICKUP TIME SLOTS
// ============================================================================

export async function placeOrder() {
    console.log('💳 Starting order placement process...');
    
    try {
        // Validate cart
        if (cart.length === 0) {
            showNotification(ERROR_MESSAGES.CART_EMPTY, 'warning');
            return false;
        }
        
        // Validate form
        const orderData = validateAndCollectOrderData();
        if (!orderData) {
            return false;
        }
        
        // Show loading state
        showOrderProcessingState(true);
        showNotification('Processing your order...', 'info');
        
        // Create order object in format expected by Google Apps Script
        const order = createGoogleSheetsCompatibleOrder(orderData);
        
        // Attempt to submit via API - CRITICAL: This enables cross-device sync
        let orderSubmitted = false;
        try {
            console.log('🌐 Submitting order to Google Apps Script API...');
            const apiResponse = await callViaProxy('place_order', { order });
            if (apiResponse.success) {
                orderSubmitted = true;
                console.log('✅ Order placed via backend - enables cross-device sync');
                showNotification('Order synced to server - visible on all devices!', 'success');
            }
        } catch (apiError) {
            console.warn('⚠️ API submission failed, falling back to local storage:', apiError);
            showNotification('⚠️ Order saved locally (limited sync)', 'warning');
        }
        
        // Save order locally regardless of API success
        orders.push(order);
        setOrders(orders);
        
        // Clear cart
        setCart([]);
        
        // Update UI
        updateCartUI();
        showOrderProcessingState(false);
        showOrderConfirmation(order, orderSubmitted);
        closeCheckoutModal();
        
        showNotification(SUCCESS_MESSAGES.ORDER_PLACED, 'success');
        console.log(`🎉 Order #${order.id} placed successfully`);
        
        return true;
        
    } catch (error) {
        console.error('💥 Order placement failed:', error);
        showOrderProcessingState(false);
        showNotification('Failed to place order. Please try again.', 'error');
        return false;
    }
}

function validateAndCollectOrderData() {
    const form = document.getElementById('checkoutForm');
    if (!form) {
        console.error('Checkout form not found');
        return null;
    }
    
    const formData = new FormData(form);
    const data = {
        customerName: formData.get('customerName')?.trim(),
        customerPhone: formData.get('customerPhone')?.trim(),
        customerEmail: formData.get('customerEmail')?.trim(),
        fulfillmentMethod: formData.get('fulfillmentMethod'),
        deliveryAddress: formData.get('deliveryAddress')?.trim(),
        deliveryCity: formData.get('deliveryCity')?.trim() || 'Accra',
        pickupTime: formData.get('pickupTime')?.trim(),
        specialInstructions: formData.get('specialInstructions')?.trim()
    };
    
    // Validate required fields
    const errors = [];
    
    if (!data.customerName || data.customerName.length < VALIDATION_RULES.LENGTHS.MIN_NAME) {
        errors.push('Customer name is required (minimum 2 characters)');
    }
    
    if (!data.customerPhone || !VALIDATION_RULES.PATTERNS.PHONE.test(data.customerPhone)) {
        errors.push('Valid phone number is required');
    }
    
    if (!data.fulfillmentMethod) {
        errors.push('Please select pickup or delivery method');
    }
    
    if (data.fulfillmentMethod === 'delivery' && !data.deliveryAddress) {
        errors.push('Delivery address is required for delivery orders');
    }
    
    if (data.fulfillmentMethod === 'pickup' && !data.pickupTime) {
        errors.push('Please select a pickup time slot');
    }
    
    if (data.customerEmail && !VALIDATION_RULES.PATTERNS.EMAIL.test(data.customerEmail)) {
        errors.push('Please enter a valid email address');
    }
    
    // Show validation errors
    if (errors.length > 0) {
        showValidationErrors(errors);
        return null;
    }
    
    return data;
}

// ENHANCED: Create order object compatible with Google Apps Script backend
function createGoogleSheetsCompatibleOrder(orderData) {
    const orderId = `GH${incrementOrderCounter()}`;
    const timestamp = new Date().toISOString();
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryOption = DELIVERY_OPTIONS.find(option => option.id === orderData.fulfillmentMethod);
    const deliveryCost = deliveryOption ? deliveryOption.cost : 0;
    const total = subtotal + deliveryCost;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Format order exactly as expected by Google Apps Script
    return {
        id: orderId,
        timestamp: timestamp,
        date: timestamp, // Add both for compatibility
        customer: {
            name: orderData.customerName,
            phone: orderData.customerPhone,
            email: orderData.customerEmail || 'Not provided'
        },
        fulfillmentMethod: orderData.fulfillmentMethod,
        delivery: {
            address: orderData.deliveryAddress || '',
            city: orderData.deliveryCity || '',
            notes: orderData.fulfillmentMethod === 'delivery' ? orderData.specialInstructions || '' : ''
        },
        pickup: {
            time: orderData.pickupTime || '',
            notes: orderData.fulfillmentMethod === 'pickup' ? orderData.specialInstructions || '' : ''
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        })),
        total: total,
        itemCount: itemCount,
        status: ORDER_STATUSES.PENDING,
        source: window.location.hostname || 'Website', // ADD THIS: Track order source
        // Legacy fields for backward compatibility
        pricing: {
            subtotal: subtotal,
            delivery: deliveryCost,
            total: total
        },
        fulfillment: {
            method: orderData.fulfillmentMethod,
            address: orderData.deliveryAddress || null,
            instructions: orderData.specialInstructions || null
        }
    };
}

// ============================================================================
// ENHANCED CHECKOUT FORM CREATION (ADD PICKUP TIME SLOTS)
// ============================================================================

// ADD THIS: Function to create enhanced checkout form with pickup time slots
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
                            Free delivery in Greater Accra for orders over GH₵200
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

// ADD THIS: Fulfillment method selection
window.selectFulfillment = function(method) {
    document.querySelectorAll('.fulfillment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.target.closest('.fulfillment-option').classList.add('selected');
    
    const deliverySection = document.getElementById('deliverySection');
    const pickupSection = document.getElementById('pickupSection');
    
    if (method === 'delivery') {
        deliverySection?.classList.remove('hidden');
        pickupSection?.classList.add('hidden');
        
        // Update form field name
        const formEl = document.createElement('input');
        formEl.type = 'hidden';
        formEl.name = 'fulfillmentMethod';
        formEl.value = 'delivery';
        document.getElementById('checkoutForm')?.appendChild(formEl);
    } else {
        deliverySection?.classList.add('hidden');
        pickupSection?.classList.remove('hidden');
        
        // Update form field name
        const formEl = document.createElement('input');
        formEl.type = 'hidden';
        formEl.name = 'fulfillmentMethod';
        formEl.value = 'pickup';
        document.getElementById('checkoutForm')?.appendChild(formEl);
    }
};

// ADD THIS: Pickup time selection
window.selectPickupTime = function(timeSlot) {
    document.querySelectorAll('.pickup-time-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.target.closest('.pickup-time-option').classList.add('selected');
    
    const hiddenInput = document.getElementById('selectedPickupTime');
    if (hiddenInput) {
        hiddenInput.value = timeSlot;
    }
};

// ============================================================================
// ORDER TRACKING - ENHANCED WITH PICKUP TIME DISPLAY
// ============================================================================

export async function trackOrder() {
    const trackingForm = document.getElementById('trackingForm');
    if (!trackingForm) return;
    
    const formData = new FormData(trackingForm);
    const orderId = formData.get('trackingId')?.trim();
    const phone = formData.get('trackingPhone')?.trim();
    
    if (!orderId || !phone) {
        showNotification('Please enter both Order ID and phone number', 'warning');
        return;
    }
    
    console.log(`🔍 Tracking order ${orderId} for phone ${phone}`);
    showNotification('Searching for your order...', 'info');
    
    try {
        // PRIORITY 1: Try to find order via API (server-side storage)
        let order = null;
        try {
            console.log('🌐 Checking Google Apps Script for order...');
            const apiResponse = await callViaProxy('lookup_customer_order', { 
                orderId, 
                phoneNumber: phone
            });
            
            if (apiResponse.success && apiResponse.data && apiResponse.data.order) {
                order = apiResponse.data.order;
                console.log('✅ Order found via Google Apps Script API (cross-device)');
                showNotification('Order found in server! ✅', 'success');
            }
        } catch (apiError) {
            console.warn('⚠️ API tracking failed, checking local storage:', apiError);
        }
        
        // PRIORITY 2: Fallback to local orders (device-specific)
        if (!order) {
            console.log('💾 Checking local storage for order...');
            order = orders.find(o => 
                o.id === orderId && 
                o.customer.phone === phone
            );
            if (order) {
                console.log('✅ Order found in local storage (device-only)');
                showNotification('⚠️ Order found locally (may not sync across devices)', 'warning');
            }
        }
        
        if (order) {
            displayOrderTrackingResult(order);
        } else {
            showOrderNotFound();
            showNotification('Order not found. Please check your details.', 'error');
            console.log('❌ Order not found in API or local storage');
        }
        
    } catch (error) {
        console.error('💥 Order tracking failed:', error);
        showNotification('Failed to track order. Please try again.', 'error');
    }
}

function displayOrderTrackingResult(order) {
    const trackingResult = document.getElementById('trackingResult');
    const orderDetails = document.getElementById('orderDetails');
    
    if (!trackingResult || !orderDetails) return;
    
    const statusClass = getStatusClass(order.status);
    const deliveryMethod = DELIVERY_OPTIONS.find(option => option.id === order.fulfillmentMethod);
    
    // Handle both new order format and legacy format
    const orderTimestamp = order.timestamp || order.date;
    const customerInfo = order.customer || {};
    const deliveryInfo = order.delivery || {};
    const pickupInfo = order.pickup || {};
    const fulfillmentMethod = order.fulfillmentMethod || order.fulfillment?.method;
    
    // ENHANCED: Better fulfillment details with pickup time display
    const fulfillmentDetails = getFulfillmentDetails(order);
    
    orderDetails.innerHTML = `
        <div class="bg-white rounded-lg border p-6">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold">Order #${order.id}</h3>
                <div class="flex items-center gap-2">
                    ${order.source ? `<span class="text-xs text-gray-500">📡 ${order.source}</span>` : ''}
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusClass}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 class="font-semibold mb-2">Customer Information</h4>
                    <p><strong>Name:</strong> ${customerInfo.name}</p>
                    <p><strong>Phone:</strong> ${customerInfo.phone}</p>
                    ${customerInfo.email && customerInfo.email !== 'Not provided' ? `<p><strong>Email:</strong> ${customerInfo.email}</p>` : ''}
                    <p><strong>Order Date:</strong> ${formatDate(orderTimestamp)}</p>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-2">Fulfillment</h4>
                    <p><strong>Method:</strong> ${deliveryMethod ? deliveryMethod.name : fulfillmentMethod || 'N/A'}</p>
                    ${fulfillmentDetails ? `<p><strong>Details:</strong> ${fulfillmentDetails}</p>` : ''}
                    ${deliveryInfo.notes ? `<p><strong>Notes:</strong> ${deliveryInfo.notes}</p>` : ''}
                    ${pickupInfo.notes ? `<p><strong>Notes:</strong> ${pickupInfo.notes}</p>` : ''}
                </div>
            </div>
            
            <div class="mb-6">
                <h4 class="font-semibold mb-3">Order Items</h4>
                <div class="space-y-2">
                    ${order.items.map(item => `
                        <div class="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span>${item.name} × ${item.quantity}</span>
                            <span class="font-medium">${formatPrice(item.subtotal || (item.price * item.quantity))}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="border-t pt-4">
                <div class="flex justify-between items-center mb-2">
                    <span>Subtotal:</span>
                    <span>${formatPrice(order.pricing?.subtotal || (order.total - (order.pricing?.delivery || 0)))}</span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span>Delivery:</span>
                    <span>${formatPrice(order.pricing?.delivery || 0)}</span>
                </div>
                <div class="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>${formatPrice(order.total)}</span>
                </div>
            </div>
            
            ${createOrderProgressTracker(order.status)}
        </div>
    `;
    
    trackingResult.classList.remove('hidden');
}

// ADD THIS: Enhanced fulfillment details helper
function getFulfillmentDetails(order) {
    if (!order.fulfillmentMethod) return '';
    
    if (order.fulfillmentMethod === 'delivery') {
        const address = order.delivery?.address || '';
        const city = order.delivery?.city || '';
        return `🚚 Delivery to: ${address}${city ? ', ' + city : ''}`;
    } else {
        const pickupTime = getPickupTimeDisplay(order.pickup?.time);
        return `🏪 Pickup: ${pickupTime} at ${STORE_INFO.address}`;
    }
}

// ADD THIS: Pickup time display helper (from working single file)
function getPickupTimeDisplay(pickupTime) {
    const timeSlots = {
        'morning': 'Morning (9:00 AM - 12:00 PM)',
        'afternoon': 'Afternoon (12:00 PM - 4:00 PM)', 
        'evening': 'Evening (4:00 PM - 7:00 PM)'
    };
    
    return timeSlots[pickupTime] || pickupTime || 'Time not specified';
}

function createOrderProgressTracker(status) {
    const steps = [
        { key: 'pending', label: 'Order Received', icon: '📝' },
        { key: 'confirmed', label: 'Order Confirmed', icon: '✅' },
        { key: 'completed', label: 'Order Completed', icon: '🎉' }
    ];
    
    const currentIndex = steps.findIndex(step => step.key === status);
    
    return `
        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
            <h4 style="font-weight: 600; margin-bottom: 1rem;">Order Progress</h4>
            <div style="display: flex; align-items: center; justify-content: space-between; position: relative;">
                ${steps.map((step, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrentStep = index === currentIndex;
                    return `
                        <div style="display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; z-index: 1;">
                            <div style="
                                width: 40px; 
                                height: 40px; 
                                border-radius: 50%; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 18px;
                                background-color: ${isActive ? '#10b981' : '#e5e7eb'};
                                color: ${isActive ? 'white' : '#6b7280'};
                                border: 2px solid ${isCurrentStep ? '#059669' : 'transparent'};
                            ">
                                ${step.icon}
                            </div>
                            <span style="
                                font-size: 12px; 
                                margin-top: 8px; 
                                text-align: center;
                                color: ${isActive ? '#059669' : '#6b7280'};
                                font-weight: ${isActive ? '500' : '400'};
                            ">
                                ${step.label}
                            </span>
                        </div>
                        ${index < steps.length - 1 ? `
                            <div style="
                                position: absolute;
                                top: 20px;
                                left: ${(index + 1) * 33.33 - 16.66}%;
                                width: 33.33%;
                                height: 2px;
                                background-color: ${index < currentIndex ? '#10b981' : '#e5e7eb'};
                                z-index: 0;
                            "></div>
                        ` : ''}
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function showOrderNotFound() {
    const trackingResult = document.getElementById('trackingResult');
    const orderDetails = document.getElementById('orderDetails');
    
    if (!trackingResult || !orderDetails) return;
    
    orderDetails.innerHTML = `
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div class="text-4xl mb-4">🔍</div>
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">Order Not Found</h3>
            <p class="text-yellow-700 mb-4">
                We couldn't find an order with those details. Please check:
            </p>
            <ul class="text-left text-yellow-700 space-y-1 max-w-sm mx-auto">
                <li>• Order ID is correct (format: GH1001, GH1002, etc.)</li>
                <li>• Phone number matches the one used for the order</li>
                <li>• Order was placed through this website</li>
            </ul>
            <p class="text-sm text-yellow-600 mt-4">
                Need help? Contact our support team at +233 59 961 3762
            </p>
        </div>
    `;
    
    trackingResult.classList.remove('hidden');
}

// ============================================================================
// ORDER STATUS MANAGEMENT - ENHANCED WITH BACKEND SYNC
// ============================================================================

export async function updateOrderStatus(orderId, newStatus, adminNotes = '', paymentMethod = '') {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return false;
    }
    
    const oldStatus = order.status;
    order.status = newStatus;
    setOrders(orders);
    
    // Refresh admin display if on admin page
    const adminPage = document.getElementById('adminPage');
    if (adminPage && !adminPage.classList.contains('hidden')) {
        // Dynamically import and refresh admin display
        import('./admin.js').then(admin => {
            admin.loadAdminData();
        }).catch(error => {
            console.warn('Could not refresh admin display:', error);
        });
    }
    
    // Try to update via API - CRITICAL: This enables cross-device sync
    try {
        const updateData = { orderId, status: newStatus };
        if (adminNotes) updateData.adminNotes = adminNotes;
        if (paymentMethod) updateData.paymentMethod = paymentMethod;
        
        const apiResponse = await callViaProxy('update_order_status', updateData);
        if (apiResponse.success) {
            console.log(`✅ Order ${orderId} status updated via API: ${oldStatus} → ${newStatus}`);
            showNotification(`Order #${orderId} synced to server`, 'success');
        }
    } catch (error) {
        console.warn(`⚠️ Failed to update order ${orderId} via API:`, error);
        showNotification(`Order #${orderId} updated locally (sync failed)`, 'warning');
    }
    
    showNotification(`Order #${orderId} marked as ${newStatus}`, 'success');
    return true;
}

// ============================================================================
// UI HELPER FUNCTIONS
// ============================================================================

function showOrderProcessingState(processing) {
    const submitButton = document.getElementById('submitOrder');
    const loadingSpinner = document.getElementById('orderLoadingSpinner');
    
    if (submitButton) {
        submitButton.disabled = processing;
        submitButton.textContent = processing ? 'Processing...' : 'Place Order';
    }
    
    if (loadingSpinner) {
        if (processing) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
    }
}

function showValidationErrors(errors) {
    const errorContainer = document.getElementById('checkoutErrors');
    if (!errorContainer) {
        // Create error container if it doesn't exist
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'checkoutErrors';
            errorDiv.className = 'mb-4 p-4 bg-red-50 border border-red-200 rounded-lg';
            checkoutForm.insertBefore(errorDiv, checkoutForm.firstChild);
        }
    }
    
    const errorEl = document.getElementById('checkoutErrors');
    if (errorEl) {
        errorEl.innerHTML = `
            <h4 class="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
            <ul class="list-disc list-inside text-red-700 space-y-1">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        errorEl.classList.remove('hidden');
        
        // Scroll to errors
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showOrderConfirmation(order, submittedViaAPI) {
    const confirmationHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="orderConfirmation">
            <div class="bg-white rounded-lg p-8 max-w-md mx-4">
                <div class="text-center">
                    <div class="text-4xl mb-4">🎉</div>
                    <h2 class="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
                    <p class="text-gray-600 mb-4">
                        Your order <strong>#${order.id}</strong> has been received and will be processed soon.
                    </p>
                    <div class="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                        <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                        <p><strong>Method:</strong> ${order.fulfillmentMethod === 'delivery' ? 'Delivery' : 'Store Pickup'}</p>
                        ${order.fulfillmentMethod === 'pickup' ? `<p><strong>Pickup Time:</strong> ${getPickupTimeDisplay(order.pickup?.time)}</p>` : ''}
                        <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    </div>
                    ${submittedViaAPI ? `
                        <div class="bg-green-50 border border-green-200 rounded p-3 mb-4">
                            <p class="text-sm text-green-700">
                                ✅ Order synced to server! You can track it from any device.
                            </p>
                        </div>
                    ` : `
                        <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                            <p class="text-sm text-yellow-700">
                                ⚠️ Order saved locally. Please check internet connection for full sync.
                            </p>
                        </div>
                    `}
                    <div class="text-sm text-gray-600 mb-4">
                        <p>Track your order: Use Order ID <strong>${order.id}</strong> and phone <strong>${order.customer.phone}</strong></p>
                    </div>
                    <button onclick="closeOrderConfirmation()" 
                            class="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    
    // Clear form
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.reset();
    }
    
    // Clear errors
    const errors = document.getElementById('checkoutErrors');
    if (errors) {
        errors.classList.add('hidden');
    }
}

function getStatusClass(status) {
    switch (status) {
        case ORDER_STATUSES.COMPLETED:
            return 'bg-green-100 text-green-800';
        case ORDER_STATUSES.CONFIRMED:
            return 'bg-blue-100 text-blue-800';
        case ORDER_STATUSES.CANCELLED:
            return 'bg-red-100 text-red-800';
        case ORDER_STATUSES.PENDING:
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
}

// ============================================================================
// UTILITY IMPORTS
// ============================================================================

function updateCartUI() {
    // Import and call cart UI update
    import('./cart.js').then(cart => {
        cart.updateCartUI();
    });
}

// ============================================================================
// DEBUG FUNCTIONS
// ============================================================================

/**
 * Debug order system - call from console
 */
window.debugOrderSystem = async function() {
    console.log('🔧 DEBUG: Testing order system...');
    
    console.log('📋 Local Orders:', orders.length);
    orders.forEach(order => {
        console.log(`  • ${order.id}: ${order.customer.name} (${order.status})`);
    });
    
    console.log('🛒 Current Cart:', cart.length, 'items');
    
    // Test API connectivity
    try {
        const apiResponse = await callViaProxy('verify_system');
        console.log('🌐 API Test:', apiResponse.success ? '✅ Working' : '❌ Failed');
    } catch (error) {
        console.log('🌐 API Test: ❌ Failed -', error.message);
    }
    
    console.log('✅ Order system debug complete');
};

// ============================================================================
// GLOBAL FUNCTION BINDINGS
// ============================================================================

// Make functions available globally for onclick handlers
window.placeOrder = placeOrder;
window.trackOrder = trackOrder;
window.updateOrderStatus = updateOrderStatus;
window.createEnhancedCheckoutForm = createEnhancedCheckoutForm;
window.closeOrderConfirmation = function() {
    const confirmation = document.getElementById('orderConfirmation');
    if (confirmation) {
        confirmation.remove();
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

export { orders, PICKUP_TIME_SLOTS, getPickupTimeDisplay };