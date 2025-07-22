// ============================================================================
        // CONFIGURATION - UPDATED TO USE PHP PROXY
        // ============================================================================
        
        // ✅ UPDATED: Using PHP Proxy instead of direct Google Apps Script URL
        
        // Google Sheets Configuration for product loading

        // ============================================================================
        // APPLICATION STATE
        // ============================================================================
        
        // Admin configuration
        let isAdmin = false;
        let currentView = 'home';
        
        // Data state
        let products = [];
        let cart = [];
        let orders = [];
        let adminStats = {};
        let isLoadingProducts = false;
        let isLoadingOrders = false;
        
        // Connection state
        let connectionStatus = 'unknown';
        let proxyStatus = 'unknown';
        
        // Search and filter state
        let filteredProducts = [];
        let currentFilter = 'all';
        let searchQuery = '';
        let orderCounter = 1000;

        // Mobile Money Payment Details
            mtn: {
                name: "GHHomegoods Store",
                number: "0599613762",
                network: "MTN Mobile Money"
            },
            vodafone: {
                name: "GHHomegoods Store", 
                number: "0205653869",
                network: "Vodafone Cash"
            },
            airteltigo: {
                name: "GHHomegoods Store",
                number: "soon", 
                network: "AirtelTigo Money"
            }
        };

        // Sample fallback products (used if Google Sheets unavailable)
            {
                id: 1,
                name: 'Kirkland Baby Wipes (Pack of 9)',
                price: 75.00,
                originalPrice: 85.00,
                category: 'baby-care',
                description: 'Scented baby wipes - gentle and effective for sensitive skin',
                imageUrl: '',
                featured: true
            },
            {
                id: 2,
                name: 'Kirkland Diapers Size 2 (112 count)',
                price: 240.00,
                category: 'baby-care',
                description: 'Premium quality diapers for babies - super absorbent and comfortable',
                imageUrl: '',
                featured: true
            },
            {
                id: 3,
                name: 'Honest Kids Organic Juice (40 pack)',
                price: 191.50,
                originalPrice: 210.00,
                category: 'food-beverages',
                description: 'Organic juice drinks variety pack - no artificial sweeteners',
                imageUrl: '',
                featured: true
            },
            {
                id: 4,
                name: 'Cheerios Honey Nut Cereal (27.5 oz)',
                price: 72.50,
                category: 'food-beverages',
                description: 'Delicious honey nut breakfast cereal - whole grain goodness',
                imageUrl: '',
                featured: true
            },
            {
                id: 5,
                name: 'Clorox Disinfecting Wipes (5 pack)',
                price: 87.67,
                category: 'cleaning-household',
                description: 'Multi-surface disinfecting wipes - kills 99.9% of germs',
                imageUrl: '',
                featured: true
            },
            {
                id: 6,
                name: 'Dawn Platinum Dish Soap (20.5 fl oz)',
                price: 48.33,
                category: 'cleaning-household',
                description: 'Premium grease-cutting dish soap - concentrated formula',
                imageUrl: '',
                featured: false
            },
            {
                id: 7,
                name: 'Dove Beauty Bar Soap (16 bars)',
                price: 28.38,
                category: 'personal-care',
                description: 'Moisturizing beauty bar soap - enriched with skin conditioners',
                imageUrl: '',
                featured: true
            },
            {
                id: 8,
                name: 'Crest Pro-Health Mouthwash (33.8 fl oz)',
                price: 51.83,
                category: 'personal-care',
                description: 'Advanced oral care mouthwash - clinically proven protection',
                imageUrl: '',
                featured: true
            }
        ];

        // ============================================================================
        // INITIALIZATION
        // ============================================================================
        
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 GHHomegoods website loaded successfully!');
            console.log('🔗 Using PHP Proxy for improved connectivity');
            
            // Initialize the application
            initializeApp();
        });

        async function initializeApp() {
            try {
                // Check for admin session
                if (sessionStorage.getItem('gh_admin_session') === 'authenticated') {
                    setAdminMode(true);
                }
                
                // Test proxy connection on startup
                await testProxyHealth();
                
                // Load products
                await loadProductsFromGoogleSheets();
                
                // Initialize search functionality
                initializeSearch();
                
                // Initialize cart UI
                updateCartUI();
                
                // Load admin data if admin
                if (isAdmin) {
                    await loadAdminData();
                }
                
                console.log('✅ Application initialized successfully');
                
            } catch (error) {
                console.error('💥 Application initialization error:', error);
                showNotification('Application initialization failed. Some features may not work properly.', 'error');
                updateConnectionStatus('offline');
            }
        }

        // ============================================================================
        // PROXY COMMUNICATION FUNCTIONS
        // ============================================================================
        
        /**
         * Make API call via PHP Proxy to Google Apps Script
         */
        }
        
        /**
         * Test PHP proxy connection
         */
        
        /**
         * Test PHP proxy health endpoint
         */
        }
        
        /**
         * Update connection status indicator
         */

        // ============================================================================
        // PRODUCT MANAGEMENT
        // ============================================================================
        
        
        
        
        
        
        

        // ============================================================================
        // CART MANAGEMENT
        // ============================================================================
        
        
        
        
        
        
        
        
        

        // ============================================================================
        // CHECKOUT PROCESS
        // ============================================================================
        
        
        
        
        async function placeOrder() {
            try {
                // Show loading state
                const placeOrderBtn = document.querySelector('#placeOrderText').parentElement;
                const placeOrderText = document.getElementById('placeOrderText');
                const placeOrderSpinner = document.getElementById('placeOrderSpinner');
                
                placeOrderBtn.disabled = true;
                placeOrderText.textContent = 'Placing Order...';
                placeOrderSpinner.classList.remove('hidden');
                
                // Get fulfillment method
                const selectedFulfillment = document.querySelector('.fulfillment-option.selected');
                const fulfillmentMethod = selectedFulfillment.textContent.toLowerCase().includes('delivery') ? 'delivery' : 'pickup';
                
                // Validate required fields
                const customerName = document.getElementById('customerName').value.trim();
                const customerPhone = document.getElementById('customerPhone').value.trim();
                const customerEmail = document.getElementById('customerEmail').value.trim();
                
                if (!customerName || !customerPhone) {
                    throw new Error('Please fill in all required customer information');
                }
                
                // Validate phone number format
                const phoneRegex = /^0\d{9}$/;
                if (!phoneRegex.test(customerPhone.replace(/\s+/g, ''))) {
                    throw new Error('Please enter a valid Ghana phone number (0XXXXXXXXX)');
                }
                
                // Validate fulfillment-specific fields
                let deliveryInfo = {};
                let pickupInfo = {};
                
                if (fulfillmentMethod === 'delivery') {
                    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
                    const deliveryCity = document.getElementById('deliveryCity').value.trim();
                    const deliveryNotes = document.getElementById('deliveryNotes').value.trim();
                    
                    if (!deliveryAddress || !deliveryCity) {
                        throw new Error('Please fill in all required delivery information');
                    }
                    
                    deliveryInfo = {
                        address: deliveryAddress,
                        city: deliveryCity,
                        notes: deliveryNotes
                    };
                } else {
                    const pickupTime = document.getElementById('pickupTime').value;
                    const pickupNotes = document.getElementById('pickupNotes').value.trim();
                    
                    if (!pickupTime) {
                        throw new Error('Please select a pickup time');
                    }
                    
                    pickupInfo = {
                        time: pickupTime,
                        notes: pickupNotes
                    };
                }
                
                // Create order object with safe defaults
                const orderId = `GH${++orderCounter}`;
                const order = {
                    id: orderId,
                    fulfillmentMethod: fulfillmentMethod,
                    customer: {
                        name: customerName,
                        phone: customerPhone,
                        email: customerEmail || 'Not provided'
                    },
                    delivery: deliveryInfo,
                    pickup: pickupInfo,
                    items: [...cart],
                    total: getCartTotal(),
                    itemCount: getCartItemCount(),
                    status: 'pending',
                    date: new Date().toISOString()
                };
                
                // Try to place order via PHP Proxy
                let orderPlaced = false;
                
                try {
                    await callViaProxy('place_order', { order });
                    orderPlaced = true;
                    console.log('✅ Order placed via PHP Proxy');
                } catch (error) {
                    console.warn('⚠️ PHP Proxy order placement failed:', error);
                    showNotification('Order saved locally. Admin will process manually.', 'warning');
                }
                
                // Store order locally regardless
                orders.unshift(order);
                updateOrderDisplay();
                
                // Show payment instructions
                showPaymentInstructions(order, orderPlaced);
                
                // Clear cart
                cart = [];
                updateCartUI();
                
            } catch (error) {
                console.error('💥 Order placement error:', error);
                showNotification(error.message || 'Failed to place order. Please try again.', 'error');
                
                // Reset button state
                const placeOrderBtn = document.querySelector('#placeOrderText').parentElement;
                const placeOrderText = document.getElementById('placeOrderText');
                const placeOrderSpinner = document.getElementById('placeOrderSpinner');
                
                placeOrderBtn.disabled = false;
                placeOrderText.textContent = 'Place Order';
                placeOrderSpinner.classList.add('hidden');
            }
        }
        
        function showPaymentInstructions(order, orderPlaced) {
            const checkoutBody = document.getElementById('checkoutBody');
            const status = orderPlaced ? 'Order successfully placed via secure proxy!' : 'Order saved locally - will be processed manually.';
            
            checkoutBody.innerHTML = `
                <div class="order-confirmation">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>${status}</h3>
                    <div class="order-number">Order #${order.id}</div>
                    <div class="order-status">⏳ Pending Payment</div>
                </div>
                
                <div class="payment-instructions">
                    <h4>💰 Payment Instructions</h4>
                    <p><strong>Total Amount: GH₵ ${order.total.toFixed(2)}</strong></p>
                    
                    <div class="payment-detail">
                        <strong>MTN Mobile Money:</strong><br>
                    </div>
                    
                    <div class="payment-detail">
                        <strong>Vodafone Cash:</strong><br>
                    </div>
                    
                    <div class="payment-detail">
                        <strong>AirtelTigo Money:</strong><br>
                    </div>
                    
                    <p style="margin-top: 1rem;"><strong>Important:</strong></p>
                    <ul style="text-align: left; margin: 0.5rem 0;">
                        <li>Send exactly <strong>GH₵ ${order.total.toFixed(2)}</strong></li>
                        <li>Include your order number <strong>${order.id}</strong> in the reference/note</li>
                        <li>We will confirm your order after payment verification</li>
                        <li>${order.fulfillmentMethod === 'delivery' ? 'Delivery within 24-48 hours after confirmation' : 'Ready for pickup within 2-4 hours after confirmation'}</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <button class="button" onclick="closeCheckout(); showNotification('Thank you! We will contact you after payment verification.', 'success');">
                        I Understand - Close
                    </button>
                </div>
                
                <div style="text-align: center; margin-top: 1rem; font-size: 0.875rem; color: #6b7280;">
                    <p>Questions? Call/WhatsApp: <strong>+233 59 961 3762</strong></p>
                </div>
            `;
        }

        // ============================================================================
        // ORDER TRACKING
        // ============================================================================
        
        
        
        async function trackOrder() {
            try {
                const orderId = document.getElementById('trackingOrderId').value.trim();
                const phoneNumber = document.getElementById('trackingPhone').value.trim();
                
                if (!orderId || !phoneNumber) {
                    showNotification('Please enter both order ID and phone number', 'warning');
                    return;
                }
                
                showLoading('Looking up your order via proxy...');
                
                let order = null;
                
                // Try to lookup via PHP Proxy first
                try {
                    const result = await callViaProxy('lookup_customer_order', {
                        orderId: orderId,
                        phoneNumber: phoneNumber
                    });
                    
                    if (result.success && result.data.order) {
                        order = result.data.order;
                        console.log('✅ Order found via PHP Proxy');
                    }
                } catch (error) {
                    console.warn('⚠️ PHP Proxy lookup failed:', error);
                }
                
                // Fallback to local orders if not found
                if (!order) {
                    const normalizePhone = (phone) => phone.replace(/\D/g, '').replace(/^233/, '0');
                    order = orders.find(o => 
                        o.id === orderId && 
                        normalizePhone(o.customer.phone) === normalizePhone(phoneNumber)
                    );
                }
                
                hideLoading();
                
                if (order) {
                    showOrderDetails(order);
                } else {
                    showNotification('Order not found or phone number does not match our records', 'error');
                }
                
            } catch (error) {
                hideLoading();
                console.error('💥 Order tracking error:', error);
                showNotification('Unable to track order. Please try again later.', 'error');
            }
        }
        
        function showOrderDetails(order) {
            const trackingResult = document.getElementById('trackingResult');
            
            // Safely handle order status
            const orderStatus = order.status || 'pending';
            
            const statusSteps = [
                { id: 'pending', label: 'Order Placed', icon: '📝' },
                { id: 'confirmed', label: 'Payment Confirmed', icon: '✅' },
                { id: 'completed', label: (order.fulfillmentMethod || 'delivery') === 'delivery' ? 'Delivered' : 'Picked Up', icon: '📦' }
            ];
            
            const currentIndex = statusSteps.findIndex(step => step.id === orderStatus);
            
            const statusHTML = statusSteps.map((step, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const className = isCompleted ? 'completed' : (isCurrent ? 'current' : '');
                
                return `
                    <div class="status-step ${className}">
                        <div class="status-icon">${step.icon}</div>
                        <div style="font-size: 0.875rem; font-weight: 600;">${step.label}</div>
                    </div>
                `;
            }).join('');
            
            const itemsList = (order.items || []).map(item => 
                `${item.name || 'Unknown Item'} × ${item.quantity || 1}`
            ).join(', ') || 'No items';
            
            const fulfillmentDetails = (order.fulfillmentMethod || 'delivery') === 'delivery' 
                ? `🚚 Delivery to: ${order.delivery?.address || 'Address not specified'}${order.delivery?.city ? ', ' + order.delivery.city : ''}`
                : `🏪 Pickup: ${order.pickup?.time || 'Time not specified'} slot`;
            
            const statusDisplayMap = {
                'pending': '⏳ Pending Payment',
                'confirmed': '✅ Payment Confirmed',
                'completed': '📦 ' + ((order.fulfillmentMethod || 'delivery') === 'delivery' ? 'Delivered' : 'Picked Up')
            };
            
            const statusDisplay = statusDisplayMap[orderStatus] || '⏳ Pending Payment';
            
            trackingResult.innerHTML = `
                <h3>Order #${order.id || 'Unknown'}</h3>
                
                <div class="order-status-tracker">
                    ${statusHTML}
                </div>
                
                <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <div style="margin-bottom: 1rem;">
                        <strong>Status:</strong> 
                        <span class="order-status-badge status-${orderStatus}">
                            ${statusDisplay}
                        </span>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong>Items:</strong> ${itemsList}
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong>Total:</strong> GH₵ ${(order.total || 0).toFixed(2)}
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong>Fulfillment:</strong> ${fulfillmentDetails}
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <strong>Order Date:</strong> ${new Date(order.date || Date.now()).toLocaleDateString()}
                    </div>
                    
                    ${orderStatus === 'pending' ? `
                        <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                            <strong>⏳ Awaiting Payment</strong>
                            <p style="margin: 0.5rem 0 0; font-size: 0.875rem;">Please complete payment using the mobile money details provided in your order confirmation.</p>
                        </div>
                    ` : orderStatus === 'confirmed' ? `
                        <div style="background: #dcfce7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #16a34a;">
                            <strong>✅ Payment Confirmed</strong>
                            <p style="margin: 0.5rem 0 0; font-size: 0.875rem;">Your order is being prepared for ${order.fulfillmentMethod || 'delivery'}.</p>
                        </div>
                    ` : `
                        <div style="background: #dbeafe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #2563eb;">
                            <strong>📦 Order Complete</strong>
                            <p style="margin: 0.5rem 0 0; font-size: 0.875rem;">Thank you for your business!</p>
                        </div>
                    `}
                </div>
                
                <div style="text-align: center; margin-top: 1rem;">
                    <p style="font-size: 0.875rem; color: #6b7280;">
                        Questions about your order? Call/WhatsApp: <strong>+233 59 961 3762</strong>
                    </p>
                </div>
            `;
            
            trackingResult.classList.remove('hidden');
        }

        // ============================================================================
        // ADMIN FUNCTIONS
        // ============================================================================
        
        
        async function loadAdminStats() {
            try {
                // Try to load from PHP Proxy
                try {
                    const result = await callViaProxy('get_admin_stats');
                    if (result.success && result.data.stats) {
                        adminStats = result.data.stats;
                        updateAdminStatsDisplay();
                        return;
                    }
                } catch (error) {
                    console.warn('⚠️ Failed to load stats via PHP Proxy:', error);
                }
                
                // Fallback to local calculation
                calculateLocalStats();
                updateAdminStatsDisplay();
                
            } catch (error) {
                console.error('💥 Admin stats loading error:', error);
            }
        }
        
        function calculateLocalStats() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - 7);
            
            let totalOrders = orders.length;
            let pendingOrders = orders.filter(o => (o.status || 'pending') === 'pending').length;
            let confirmedOrders = orders.filter(o => (o.status || 'pending') === 'confirmed').length;
            let completedOrders = orders.filter(o => (o.status || 'pending') === 'completed').length;
            let totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            let todayOrders = orders.filter(o => {
                const orderDate = new Date(o.date || Date.now());
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === today.getTime();
            }).length;
            
            adminStats = {
                totalOrders,
                pendingOrders,
                confirmedOrders,
                completedOrders,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                todayOrders,
                avgOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
                lastUpdated: new Date()
            };
        }
        
        function updateAdminStatsDisplay() {
            const statsContainer = document.getElementById('adminStats');
            if (!statsContainer || !adminStats) return;
            
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${adminStats.totalOrders || 0}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${adminStats.pendingOrders || 0}</div>
                    <div class="stat-label">Pending Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">GH₵${(adminStats.totalRevenue || 0).toFixed(0)}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${adminStats.todayOrders || 0}</div>
                    <div class="stat-label">Today's Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">GH₵${(adminStats.avgOrderValue || 0).toFixed(0)}</div>
                    <div class="stat-label">Avg Order Value</div>
                </div>
            `;
        }
        
        async function loadOrdersForAdmin() {
            setOrdersLoadingState(true);
            
            try {
                // Try to load from PHP Proxy
                try {
                    const result = await callViaProxy('get_orders', { limit: 50 });
                    if (result.success && result.data.orders) {
                        orders = result.data.orders;
                        console.log(`✅ Loaded ${orders.length} orders via PHP Proxy`);
                        
                        // Debug: Log first order structure to understand the data
                        if (orders.length > 0) {
                            console.log('🔍 Sample order structure:', JSON.stringify(orders[0], null, 2));
                            console.log('🔍 Status field type:', typeof orders[0].status, 'Value:', orders[0].status);
                        }
                    }
                } catch (error) {
                    console.warn('⚠️ Failed to load orders via PHP Proxy:', error);
                }
                
                updateOrderDisplay();
                
            } catch (error) {
                console.error('💥 Orders loading error:', error);
                showNotification('Failed to load orders', 'error');
            }
            
            setOrdersLoadingState(false);
        }
        
        async function updateOrderStatus(orderId, status, paymentMethod = '', adminNotes = '') {
            try {
                showLoading('Updating order status via proxy...');
                
                // Try to update via PHP Proxy
                try {
                    await callViaProxy('update_order_status', {
                        orderId,
                        status,
                        paymentMethod,
                        adminNotes
                    });
                    console.log(`✅ Order ${orderId} updated via PHP Proxy`);
                } catch (error) {
                    console.warn('⚠️ PHP Proxy update failed:', error);
                    showNotification('Updated locally - sync with Google Sheets manually', 'warning');
                }
                
                // Update local order with safe defaults
                const order = orders.find(o => o.id === orderId);
                if (order) {
                    order.status = status || 'pending';
                    if (paymentMethod) order.paymentMethod = paymentMethod;
                    if (adminNotes) order.adminNotes = adminNotes;
                    order.dateUpdated = new Date();
                }
                
                updateOrderDisplay();
                updateAdminStatsDisplay();
                hideLoading();
                
                const statusMessages = {
                    'confirmed': 'Payment confirmed! Order is ready for processing.',
                    'completed': 'Order marked as completed.'
                };
                
                showNotification(statusMessages[status] || `Order status updated to ${status}`, 'success');
                
            } catch (error) {
                hideLoading();
                console.error('💥 Order status update error:', error);
                showNotification('Failed to update order status', 'error');
            }
        }
        
        function updateOrderDisplay() {
            const ordersContainer = document.getElementById('ordersContainer');
            const orderCount = document.getElementById('orderCount');
            const adminOrderCount = document.getElementById('adminOrderCount');
            
            if (orderCount) {
                orderCount.textContent = orders.length;
            }
            if (adminOrderCount) {
                adminOrderCount.textContent = orders.filter(o => String(o.status || 'pending').toLowerCase() === 'pending').length;
            }
            
            if (!ordersContainer) return;
            
            if (orders.length === 0) {
                ordersContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #6b7280;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                        <h3>No orders yet</h3>
                        <p>Orders will appear here once customers place them</p>
                    </div>
                `;
                return;
            }
            
            const ordersHTML = orders.slice(0, 20).map(order => {
                // Extra robust handling - convert everything to strings and provide defaults
                const safeOrder = {
                    id: String(order.id || 'Unknown'),
                    status: String(order.status || 'pending').toLowerCase(),
                    date: order.date || Date.now(),
                    total: Number(order.total || 0),
                    itemCount: Number(order.itemCount || 0),
                    fulfillmentMethod: String(order.fulfillmentMethod || 'delivery'),
                    customer: {
                        name: String(order.customer?.name || 'Unknown Customer'),
                        phone: String(order.customer?.phone || 'N/A'),
                        email: String(order.customer?.email || 'N/A')
                    },
                    delivery: {
                        address: String(order.delivery?.address || ''),
                        city: String(order.delivery?.city || ''),
                        notes: String(order.delivery?.notes || '')
                    },
                    pickup: {
                        time: String(order.pickup?.time || ''),
                        notes: String(order.pickup?.notes || '')
                    },
                    items: Array.isArray(order.items) ? order.items : []
                };
                
                console.log('🔍 Processing order:', safeOrder.id, 'Status type:', typeof safeOrder.status, 'Status value:', safeOrder.status);
                
                const orderDate = new Date(safeOrder.date).toLocaleString();
                const statusClass = `status-${safeOrder.status}`;
                const statusIcon = safeOrder.status === 'pending' ? '⏳' : 
                                 safeOrder.status === 'confirmed' ? '✅' : '📦';
                
                const itemsList = safeOrder.items.map(item => 
                    `${String(item.name || 'Unknown Item')} × ${Number(item.quantity || 1)}`
                ).join(', ') || 'No items';
                
                const fulfillmentDetails = safeOrder.fulfillmentMethod === 'delivery' 
                    ? `🚚 Delivery: ${safeOrder.delivery.address}${safeOrder.delivery.city ? ', ' + safeOrder.delivery.city : ''}`
                    : `🏪 Pickup: ${safeOrder.pickup.time || 'Time not specified'} slot`;
                
                // ULTRA-SAFE status text generation
                let statusText = 'Pending';
                try {
                    if (safeOrder.status && typeof safeOrder.status === 'string' && safeOrder.status.length > 0) {
                        statusText = safeOrder.status.charAt(0).toUpperCase() + safeOrder.status.slice(1);
                    }
                } catch (e) {
                    console.warn('Status text error for order', safeOrder.id, ':', e);
                    statusText = 'Unknown';
                }
                
                return `
                    <div class="order-card">
                        <div class="order-header">
                            <span class="order-id">Order #${safeOrder.id}</span>
                            <span class="order-status-badge ${statusClass}">
                                ${statusIcon} ${statusText}
                            </span>
                        </div>
                        
                        <div class="order-details">
                            <div class="order-info">
                                <strong>Customer:</strong><br>
                                ${safeOrder.customer.name}<br>
                                📞 ${safeOrder.customer.phone}<br>
                                ✉️ ${safeOrder.customer.email}
                            </div>
                            <div class="order-info">
                                <strong>Fulfillment:</strong><br>
                                ${fulfillmentDetails}<br>
                                ${safeOrder.delivery.notes || safeOrder.pickup.notes ? 
                                  `<em>${safeOrder.delivery.notes || safeOrder.pickup.notes}</em>` : ''}
                            </div>
                        </div>
                        
                        <div class="order-info" style="margin: 1rem 0;">
                            <strong>Items:</strong> ${itemsList}<br>
                            <strong>Total:</strong> GH₵ ${safeOrder.total.toFixed(2)} (${safeOrder.itemCount} items)<br>
                            <strong>Date:</strong> ${orderDate}
                        </div>
                        
                        <div class="order-actions">
                            ${safeOrder.status === 'pending' ? `
                                <button class="action-btn btn-confirm" onclick="confirmPayment('${safeOrder.id}')">
                                    ✅ Confirm Payment
                                </button>
                                <button class="action-btn btn-cancel" onclick="cancelOrder('${safeOrder.id}')">
                                    ❌ Cancel Order
                                </button>
                            ` : ''}
                            ${safeOrder.status === 'confirmed' ? `
                                <button class="action-btn btn-complete" onclick="completeOrder('${safeOrder.id}')">
                                    📦 Mark as ${safeOrder.fulfillmentMethod === 'delivery' ? 'Delivered' : 'Picked Up'}
                                </button>
                            ` : ''}
                            <button class="action-btn" style="background: #6b7280; color: white;" onclick="viewOrderDetails('${safeOrder.id}')">
                                👁️ View Details
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            ordersContainer.innerHTML = ordersHTML;
        }
        
        function confirmPayment(orderId) {
            const paymentMethod = prompt('Enter payment method (e.g., MTN Mobile Money):');
            if (paymentMethod) {
                updateOrderStatus(orderId, 'confirmed', paymentMethod, 'Payment verified by admin');
            }
        }
        
        function completeOrder(orderId) {
            const order = orders.find(o => o.id === orderId);
            const fulfillmentText = (order?.fulfillmentMethod || 'delivery') === 'delivery' ? 'delivered' : 'picked up';
            
            if (confirm(`Mark order #${orderId} as ${fulfillmentText}?`)) {
                updateOrderStatus(orderId, 'completed', '', `Order ${fulfillmentText} successfully`);
            }
        }
        
        function cancelOrder(orderId) {
            if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                orders = orders.filter(o => o.id !== orderId);
                updateOrderDisplay();
                updateAdminStatsDisplay();
                showNotification('Order cancelled successfully', 'info');
            }
        }
        
        function viewOrderDetails(orderId) {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;
            
            const orderDate = new Date(order.date || Date.now()).toLocaleString();
            const itemsList = (order.items || []).map(item => 
                `${item.name || 'Unknown Item'} × ${item.quantity || 1} = GH₵ ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
            ).join('\n') || 'No items';
            
            const fulfillmentDetails = (order.fulfillmentMethod || 'delivery') === 'delivery' 
                ? `Delivery Address:\n${order.delivery?.address || 'Address not specified'}${order.delivery?.city ? ', ' + order.delivery.city : ''}\n${order.delivery?.notes ? `Notes: ${order.delivery.notes}` : ''}`
                : `Pickup: ${order.pickup?.time || 'Time not specified'} slot\n${order.pickup?.notes ? `Notes: ${order.pickup.notes}` : ''}`;
            
            alert(`Order Details - #${order.id}\n\n` +
                  `Customer: ${order.customer?.name || 'Unknown Customer'}\n` +
                  `Phone: ${order.customer?.phone || 'N/A'}\n` +
                  `Email: ${order.customer?.email || 'N/A'}\n\n` +
                  `${fulfillmentDetails}\n\n` +
                  `Items:\n${itemsList}\n\n` +
                  `Total: GH₵ ${(order.total || 0).toFixed(2)}\n` +
                  `Status: ${(order.status || 'pending').toUpperCase()}\n` +
                  `${order.paymentMethod ? `Payment: ${order.paymentMethod}\n` : ''}` +
                  `Date: ${orderDate}`);
        }
        
        async function refreshOrders() {
            if (!isAdmin) return;
            
            showNotification('Refreshing orders via proxy...', 'info');
            await loadOrdersForAdmin();
            await loadAdminStats();
            showNotification('Orders refreshed successfully', 'success');
        }

        // ============================================================================
        // NAVIGATION FUNCTIONS
        // ============================================================================
        



        function setActiveView(view) {
            currentView = view;
            document.querySelectorAll('.nav-button').forEach(btn => {
                btn.classList.remove('active');
            });
            const viewBtn = document.getElementById(view + 'Btn');
            if (viewBtn) {
                viewBtn.classList.add('active');
            }
        }

        // ============================================================================
        // ADMIN AUTHENTICATION
        // ============================================================================
        


        }



        // ============================================================================
        // SEARCH FUNCTIONALITY
        // ============================================================================
        
        function initializeSearch() {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', handleSearch);
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                });
            }
        }

        function handleSearch() {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchQuery = searchInput.value;
                updateProductDisplay();
            }
        }

        function filterByCategory(category) {
            currentFilter = category;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            updateProductDisplay();
        }


        // ============================================================================
        // MODAL FUNCTIONS
        // ============================================================================
        



        // ============================================================================
        // UTILITY FUNCTIONS
        // ============================================================================
        
        function showLoading(message = 'Loading...') {
            const loadingOverlay = document.getElementById('loadingOverlay');
            const loadingMessage = document.getElementById('loadingMessage');
            loadingMessage.textContent = message;
            loadingOverlay.classList.remove('hidden');
        }
        
        function hideLoading() {
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.add('hidden');
        }
        
        function setLoadingState(loading) {
            isLoadingProducts = loading;
            const refreshBtn = document.getElementById('refreshBtn');
            const refreshText = document.getElementById('refreshText');
            const refreshSpinner = document.getElementById('refreshSpinner');
            
            if (refreshBtn && refreshText && refreshSpinner) {
                refreshBtn.disabled = loading;
                refreshText.textContent = loading ? 'Loading...' : 'Refresh Products';
                if (loading) {
                    refreshSpinner.classList.remove('hidden');
                } else {
                    refreshSpinner.classList.add('hidden');
                }
            }
        }
        
        function setOrdersLoadingState(loading) {
            isLoadingOrders = loading;
            const ordersText = document.getElementById('ordersText');
            const ordersSpinner = document.getElementById('ordersSpinner');
            
            if (ordersText && ordersSpinner) {
                ordersText.textContent = loading ? 'Loading...' : 'Refresh Orders';
                if (loading) {
                    ordersSpinner.classList.remove('hidden');
                } else {
                    ordersSpinner.classList.add('hidden');
                }
            }
        }

        function updateProductCount() {
            const productCountEl = document.getElementById('productCount');
            if (productCountEl) {
                productCountEl.textContent = products.length;
            }
        }

        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 4000);
        }

        

        // ============================================================================
        // EVENT LISTENERS
        // ============================================================================
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                showAdminModal();
            }
            
            if (e.key === 'Escape') {
                closeCart();
                closeCheckout();
                closeAdminModal();
                closeTracking();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput && !document.getElementById('shopPage').classList.contains('hidden')) {
                    searchInput.focus();
                }
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', function(e) {
            const cartModal = document.getElementById('cartModal');
            const checkoutModal = document.getElementById('checkoutModal');
            const trackingModal = document.getElementById('trackingModal');
            const cartButton = document.querySelector('.cart-button');
            
            if (cartModal.classList.contains('open') && 
                !cartModal.contains(e.target) && 
                !cartButton.contains(e.target)) {
                closeCart();
            }
            
            if (checkoutModal.style.display === 'flex' && 
                e.target === checkoutModal) {
                closeCheckout();
            }
            
            if (trackingModal.style.display === 'flex' && 
                e.target === trackingModal) {
                closeTracking();
            }
        });

        // Admin password enter key
        document.addEventListener('DOMContentLoaded', function() {
            const adminPassword = document.getElementById('adminPassword');
            if (adminPassword) {
                adminPassword.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        adminLogin();
                    }
                });
            }
        });

        // Modal backdrop click
        document.addEventListener('DOMContentLoaded', function() {
            const modalBackdrop = document.getElementById('modalBackdrop');
            if (modalBackdrop) {
                modalBackdrop.addEventListener('click', closeAdminModal);
            }
        });

        // ============================================================================
        // DEBUG FUNCTIONS (for troubleshooting)
        // ============================================================================
        
        /**
         * Debug function to inspect order data - call from console
         */
        function debugOrders() {
            console.log('🔍 DEBUGGING ORDERS:');
            console.log('Total orders:', orders.length);
            
            orders.forEach((order, index) => {
                console.log(`\n📋 Order ${index + 1}:`, {
                    id: order.id,
                    status: order.status,
                    statusType: typeof order.status,
                    statusLength: order.status ? order.status.length : 'N/A',
                    customer: order.customer?.name,
                    total: order.total
                });
            });
            
            return orders;
        }
        
        /**
         * Debug function to test image URLs - call from console
         */
        function debugImages() {
            console.log('🖼️ DEBUGGING IMAGES:');
            
            products.slice(0, 5).forEach((product, index) => {
                console.log(`\n📦 Product ${index + 1}:`, {
                    name: product.name,
                    originalUrl: product.imageUrl,
                    hasImage: !!product.imageUrl,
                    urlLength: product.imageUrl ? product.imageUrl.length : 0
                });
            });
            
            return products.filter(p => p.imageUrl);
        }
        
        // Make debug functions globally available
        window.debugOrders = debugOrders;
        window.debugImages = debugImages;

        // ============================================================================
        // INITIALIZATION COMPLETE
        // ============================================================================
        
        console.log('🚀 GHHomegoods Integrated E-commerce System Loaded');
        console.log('📱 Features: Product Management, Shopping Cart, Order Processing, Admin Panel');
        console.log('🔧 PHP Proxy Integration for Improved Connectivity');
        console.log('✅ System Ready for Production Use');