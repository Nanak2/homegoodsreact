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

// Export the current admin state
export { isAdmin };