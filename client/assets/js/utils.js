// utils.js - Utility functions and shared state

// ============================================================================
// SHARED STATE VARIABLES
// ============================================================================

export let cart = [];
export let orders = [];
export let products = [];
export let isAdmin = sessionStorage.getItem('gh_admin_session') === 'authenticated';
export let orderCounter = parseInt(localStorage.getItem('orderCounter')) || 1000;
export let currentFilter = 'all';
export let searchQuery = '';
export let isLoadingProducts = false;
export let isLoadingOrders = false;

// State setters
export function setCart(newCart) {
    cart = newCart;
    localStorage.setItem('gh_cart', JSON.stringify(cart));
}

export function setOrders(newOrders) {
    orders = newOrders;
    localStorage.setItem('gh_orders', JSON.stringify(orders));
}

export function setProducts(newProducts) {
    products = newProducts;
}

export function setIsAdmin(admin) {
    isAdmin = admin;
    if (admin) {
        sessionStorage.setItem('gh_admin_session', 'authenticated');
    } else {
        sessionStorage.removeItem('gh_admin_session');
    }
}

export function setCurrentFilter(filter) {
    currentFilter = filter;
}

export function setSearchQuery(query) {
    searchQuery = query;
}

export function setLoadingStates(productsLoading = false, ordersLoading = false) {
    isLoadingProducts = productsLoading;
    isLoadingOrders = ordersLoading;
}

export function incrementOrderCounter() {
    orderCounter++;
    localStorage.setItem('orderCounter', orderCounter.toString());
    return orderCounter;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Show notification to user
 */
export function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Set notification style based on type
    const styles = {
        success: 'background-color: #10b981; border-left: 4px solid #059669;',
        error: 'background-color: #ef4444; border-left: 4px solid #dc2626;',
        warning: 'background-color: #f59e0b; border-left: 4px solid #d97706;',
        info: 'background-color: #3b82f6; border-left: 4px solid #2563eb;'
    };
    
    notification.style.cssText += styles[type] || styles.info;
    notification.textContent = message;
    
    // Show notification
    notification.style.transform = 'translateX(0)';
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 4000);
}

/**
 * Set active view in localStorage
 */
export function setActiveView(view) {
    localStorage.setItem('activeView', view);
}

/**
 * Show/hide loading spinner
 */
export function showLoading(message = 'Loading...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingOverlay && loadingMessage) {
        loadingMessage.textContent = message;
        loadingOverlay.classList.remove('hidden');
    }
}

export function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

/**
 * Set loading state for refresh button
 */
export function setLoadingState(loading) {
    setLoadingStates(loading, isLoadingOrders);
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

/**
 * Set loading state for orders
 */
export function setOrdersLoadingState(loading) {
    setLoadingStates(isLoadingProducts, loading);
    const ordersText = document.getElementById('ordersText');
    const ordersSpinner = document.getElementById('ordersSpinner');
    
    if (ordersText && ordersSpinner) {
        ordersText.textContent = loading ? 'Loading Orders...' : 'Orders';
        if (loading) {
            ordersSpinner.classList.remove('hidden');
        } else {
            ordersSpinner.classList.add('hidden');
        }
    }
}

/**
 * Format price for display
 */
export function formatPrice(price) {
    if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^\d.-]/g, ''));
    }
    return `GH₵${price?.toFixed(2) || '0.00'}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Initialize shared state from localStorage
 */
export function initializeState() {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('gh_cart');
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch (error) {
            console.warn('Failed to load cart from localStorage:', error);
            cart = [];
        }
    }
    
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('gh_orders');
    if (storedOrders) {
        try {
            orders = JSON.parse(storedOrders);
        } catch (error) {
            console.warn('Failed to load orders from localStorage:', error);
            orders = [];
        }
    }
    
    // Load order counter
    const storedCounter = localStorage.getItem('orderCounter');
    if (storedCounter) {
        orderCounter = parseInt(storedCounter) || 1000;
    }
}