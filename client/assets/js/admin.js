// admin.js - Admin authentication and management

import { 
    showNotification, 
    isAdmin, 
    setIsAdmin,
    orders,
    setOrdersLoadingState,
    formatPrice,
    formatDate
} from './utils.js';

// Configuration - In production, this should come from environment variables
const ADMIN_PASSWORD = 'GHAdmin2025!'; // This should be moved to config.js or env

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================

export function adminLogin() {
    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput?.value;
    
    if (!password) {
        showNotification('Please enter admin password', 'warning');
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        setAdminMode(true);
        closeAdminModal();
        showAdmin();
        showNotification('Admin login successful', 'success');
        console.log('👑 Admin logged in successfully');
    } else {
        showNotification('Invalid admin password', 'error');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
        console.log('❌ Invalid admin login attempt');
    }
}

export function adminLogout() {
    setAdminMode(false);
    showHome();
    showNotification('Admin logged out', 'info');
    console.log('👋 Admin logged out');
}

export function setAdminMode(admin) {
    setIsAdmin(admin);
    
    const adminBtn = document.getElementById('adminBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminNotice = document.getElementById('adminNotice');
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    
    if (admin) {
        adminBtn?.classList.remove('hidden');
        logoutBtn?.classList.remove('hidden');
        if (adminNotice) adminNotice.style.display = 'block';
        adminAccessBtn?.classList.add('hidden');
        loadAdminData();
    } else {
        adminBtn?.classList.add('hidden');
        logoutBtn?.classList.add('hidden');
        if (adminNotice) adminNotice.style.display = 'none';
        adminAccessBtn?.classList.remove('hidden');
    }
    
    console.log(`👑 Admin mode ${admin ? 'enabled' : 'disabled'}`);
}

// ============================================================================
// ADMIN DATA MANAGEMENT
// ============================================================================

export function loadAdminData() {
    if (!isAdmin) {
        console.log('⛔ Access denied - not admin');
        return;
    }
    
    console.log('📊 Loading admin data...');
    
    Promise.all([
        loadAdminStats(),
        loadOrdersForAdmin()
    ]).then(() => {
        console.log('✅ Admin data loaded successfully');
    }).catch(error => {
        console.error('💥 Admin data loading error:', error);
        showNotification('Failed to load admin data', 'error');
    });
}

export function loadAdminStats() {
    return new Promise((resolve) => {
        try {
            const stats = calculateOrderStats();
            updateAdminStatsDisplay(stats);
            resolve(stats);
        } catch (error) {
            console.error('Error calculating admin stats:', error);
            resolve({});
        }
    });
}

export function loadOrdersForAdmin() {
    return new Promise((resolve) => {
        try {
            setOrdersLoadingState(true);
            
            // In a real app, this would fetch from server
            // For now, use local orders
            setTimeout(() => {
                updateOrdersDisplay();
                setOrdersLoadingState(false);
                resolve(orders);
            }, 500);
            
        } catch (error) {
            setOrdersLoadingState(false);
            console.error('Error loading orders for admin:', error);
            resolve([]);
        }
    });
}

// ============================================================================
// ADMIN STATISTICS
// ============================================================================

function calculateOrderStats() {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    
    const statusCounts = orders.reduce((counts, order) => {
        const status = order.status || 'pending';
        counts[status] = (counts[status] || 0) + 1;
        return counts;
    }, {});
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        pendingOrders: statusCounts.pending || 0,
        confirmedOrders: statusCounts.confirmed || 0,
        completedOrders: statusCounts.completed || 0
    };
}

function updateAdminStatsDisplay(stats = null) {
    if (!stats) {
        stats = calculateOrderStats();
    }
    
    // Update total orders
    const totalOrdersEl = document.getElementById('totalOrders');
    if (totalOrdersEl) {
        totalOrdersEl.textContent = stats.totalOrders;
    }
    
    // Update total revenue
    const totalRevenueEl = document.getElementById('totalRevenue');
    if (totalRevenueEl) {
        totalRevenueEl.textContent = formatPrice(stats.totalRevenue);
    }
    
    // Update average order value
    const avgOrderValueEl = document.getElementById('avgOrderValue');
    if (avgOrderValueEl) {
        avgOrderValueEl.textContent = formatPrice(stats.averageOrderValue);
    }
    
    // Update pending orders
    const pendingOrdersEl = document.getElementById('pendingOrders');
    if (pendingOrdersEl) {
        pendingOrdersEl.textContent = stats.pendingOrders;
    }
    
    console.log('📊 Admin stats updated:', stats);
}

function updateOrdersDisplay() {
    const ordersContainer = document.getElementById('ordersContainer');
    const orderCount = document.getElementById('orderCount');
    
    if (!ordersContainer) return;
    
    // Update order count
    if (orderCount) {
        orderCount.textContent = orders.length;
    }
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No orders found</p>';
        return;
    }
    
    const ordersHTML = orders.map(order => {
        const isCompleted = order.status === 'completed';
        const isConfirmed = order.status === 'confirmed';
        const isPending = order.status === 'pending';
        
        return `
            <div class="border rounded-lg p-4 bg-white mb-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-lg">Order #${order.id}</h3>
                    <span class="px-3 py-1 rounded-full text-sm ${getStatusClass(order.status)}">
                        ${order.status || 'pending'}
                    </span>
                </div>
                <div class="text-gray-600 mb-2">
                    <p><strong>Customer:</strong> ${order.customer?.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
                    <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                    <p><strong>Date:</strong> ${formatDate(order.timestamp)}</p>
                </div>
                <div class="flex gap-2 mt-3">
                    ${isPending ? `
                        <button onclick="updateOrderStatus('${order.id}', 'confirmed')" 
                                class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                            Confirm Order
                        </button>
                    ` : ''}
                    ${(isPending || isConfirmed) && !isCompleted ? `
                        <button onclick="updateOrderStatus('${order.id}', 'completed')" 
                                class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                            Mark Complete
                        </button>
                    ` : ''}
                    ${isCompleted ? `
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            ✅ Order Completed
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    ordersContainer.innerHTML = ordersHTML;
}

function getStatusClass(status) {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'pending':
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
}

// ============================================================================
// CONNECTION TESTING
// ============================================================================

export function testConnection() {
    showNotification('Testing connection...', 'info');
    console.log('🔧 Testing connection...');
    
    // Simulate connection test
    setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for demo
        if (success) {
            showNotification('Connection test successful', 'success');
            console.log('✅ Connection test passed');
        } else {
            showNotification('Connection test failed', 'error');
            console.log('❌ Connection test failed');
        }
    }, 1000);
}

export function testProxyHealth() {
    showNotification('Testing proxy health...', 'info');
    console.log('🏥 Testing proxy health...');
    
    // In a real app, this would make an actual request to proxy.php?health=1
    // For now, simulate the test
    setTimeout(() => {
        const healthy = Math.random() > 0.3; // 70% healthy rate for demo
        if (healthy) {
            showNotification('Proxy is healthy', 'success');
            console.log('✅ Proxy health check passed');
        } else {
            showNotification('Proxy is unhealthy', 'error');
            console.log('❌ Proxy health check failed');
        }
    }, 1500);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function closeAdminModal() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const adminModal = document.getElementById('adminModal');
    
    if (modalBackdrop) modalBackdrop.style.display = 'none';
    if (adminModal) adminModal.style.display = 'none';
}

function showHome() {
    // This will trigger the navigation
    window.showHome?.();
}

function showAdmin() {
    // This will trigger the navigation
    window.showAdmin?.();
}

// ============================================================================
// GLOBAL EXPORTS FOR WINDOW BINDING
// ============================================================================

// Make updateOrderStatus available globally
window.updateOrderStatus = function(orderId, newStatus) {
    if (!isAdmin) {
        showNotification('Admin access required', 'error');
        return;
    }
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const oldStatus = orders[orderIndex].status;
    orders[orderIndex].status = newStatus;
    localStorage.setItem('gh_orders', JSON.stringify(orders));
    
    // Update displays immediately
    updateOrdersDisplay();
    updateAdminStatsDisplay();
    
    // Try API update
    updateOrderStatus(orderId, newStatus).catch(error => {
        console.warn('API update failed:', error);
    });
    
    showNotification(`Order #${orderId} marked as ${newStatus}`, 'success');
    console.log(`📋 Order ${orderId} status updated: ${oldStatus} → ${newStatus}`);
};

// Make loadAdminData available globally
window.loadAdminData = function() {
    console.log('📊 Refreshing admin data...');
    loadAdminData();
};

// CLEAN EXPORT - NO DUPLICATES - ONLY THIS ONE LINE
export { isAdmin };

// ============================================================================
// ENHANCED ADMIN FEATURES - ADD TO END OF EXISTING admin.js
// ============================================================================

// Enhanced view order details
window.viewOrderDetails = function(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const fulfillmentInfo = order.fulfillmentMethod === 'pickup' 
        ? `🏪 Pickup: ${order.pickup?.time || 'Time not specified'}`
        : `🚚 Delivery: ${order.delivery?.address || 'Address not specified'}`;
    
    const itemsList = order.items 
        ? order.items.map(item => `${item.name} × ${item.quantity} = ${formatPrice(item.subtotal || item.price * item.quantity)}`).join('\n')
        : 'Items not available';
    
    alert(`📋 Order #${orderId} Details\n\n` +
          `👤 Customer: ${order.customer?.name || 'N/A'}\n` +
          `📞 Phone: ${order.customer?.phone || 'N/A'}\n` +
          `📧 Email: ${order.customer?.email || 'Not provided'}\n\n` +
          `📦 Fulfillment: ${fulfillmentInfo}\n\n` +
          `🛒 Items:\n${itemsList}\n\n` +
          `💰 Total: ${formatPrice(order.total)}\n` +
          `📅 Date: ${formatDate(order.timestamp)}\n` +
          `📊 Status: ${order.status}`);
};

window.cancelOrder = function(orderId) {
    if (!confirm(`Are you sure you want to cancel Order #${orderId}?\n\nThis action cannot be undone.`)) {
        return;
    }
    window.updateOrderStatus(orderId, 'cancelled');
};

// Enhanced status icons function
function getStatusIcon(status) {
    const icons = {
        'pending': '⏳',
        'confirmed': '✅', 
        'completed': '🎉',
        'cancelled': '❌'
    };
    return icons[status] || '📋';
}

// Enhanced updateOrdersDisplay function - REPLACE existing one
function updateOrdersDisplayEnhanced() {
    const ordersContainer = document.getElementById('ordersContainer');
    const orderCount = document.getElementById('orderCount');
    
    if (!ordersContainer) return;
    
    if (orderCount) {
        orderCount.textContent = orders.length;
    }
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders" style="text-align: center; padding: 3rem; color: #6b7280;">
                <p style="font-size: 1.125rem; margin-bottom: 1rem;">No orders found</p>
                <button class="button" onclick="window.loadAdminData?.()">
                    🔄 Refresh Orders
                </button>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    const ordersHTML = sortedOrders.map(order => {
        const isCompleted = order.status === 'completed';
        const isConfirmed = order.status === 'confirmed';
        const isPending = order.status === 'pending';
        const isCancelled = order.status === 'cancelled';
        
        return `
            <div class="border rounded-lg p-4 bg-white mb-4 order-card">
                <div class="flex justify-between items-start mb-2 order-header">
                    <div>
                        <h3 class="font-semibold text-lg order-id">Order #${order.id}</h3>
                        <span class="px-3 py-1 rounded-full text-sm order-status-badge ${getStatusClass(order.status)}">
                            ${getStatusIcon(order.status)} ${order.status || 'pending'}
                        </span>
                    </div>
                </div>
                
                <div class="text-gray-600 mb-2">
                    <p><strong>Customer:</strong> ${order.customer?.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</p>
                    <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                    <p><strong>Date:</strong> ${formatDate(order.timestamp)}</p>
                </div>
                
                <div class="flex gap-2 mt-3 order-actions" style="flex-wrap: wrap;">
                    <!-- Always show View Details -->
                    <button onclick="viewOrderDetails('${order.id}')" 
                            class="action-btn btn-view" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%); color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
                        👁️ View Details
                    </button>
                    
                    ${isPending ? `
                        <button onclick="updateOrderStatus('${order.id}', 'confirmed')" 
                                class="action-btn btn-confirm" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
                            ✅ Confirm Payment
                        </button>
                        <button onclick="cancelOrder('${order.id}')" 
                                class="action-btn btn-cancel" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
                            ❌ Cancel Order
                        </button>
                    ` : ''}
                    
                    ${isConfirmed ? `
                        <button onclick="updateOrderStatus('${order.id}', 'completed')" 
                                class="action-btn btn-complete" style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">
                            🎉 Mark Complete
                        </button>
                    ` : ''}
                    
                    ${isCompleted ? `
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            ✅ Order Completed
                        </span>
                    ` : ''}
                    
                    ${isCancelled ? `
                        <span class="px-3 py-1 bg-red-100 text-red-600 rounded text-sm">
                            ❌ Order Cancelled
                        </span>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    ordersContainer.innerHTML = ordersHTML;
}

// Replace the original function
updateOrdersDisplay = updateOrdersDisplayEnhanced;

// Make sure enhanced admin loads by default
if (typeof window.loadAdminData === 'function') {
    setTimeout(() => {
        try {
            window.loadAdminData();
        } catch (error) {
            console.warn('Could not auto-refresh admin data:', error);
        }
    }, 500);
}

console.log('✅ Enhanced admin features loaded');