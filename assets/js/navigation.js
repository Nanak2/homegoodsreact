// navigation.js - Page navigation and UI state management

import { 
    showNotification, 
    setActiveView, 
    cart, 
    orders, 
    setCart, 
    setOrders, 
    incrementOrderCounter,
    currentFilter,
    setCurrentFilter
} from './utils.js';

// ============================================================================
// PAGE NAVIGATION FUNCTIONS
// ============================================================================

export function showHome() {
    setActiveView('home');
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('shopPage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    
    // Update active navigation
    updateActiveNavigation('home');
    
    console.log('📄 Showing Home page');
}

export function showShop(category = null) {
    setActiveView('shop');
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('shopPage').classList.remove('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    
    // Update active navigation
    updateActiveNavigation('shop');
    
    // Initialize search if not already done
    initializeSearch();
    
    // Apply category filter if provided
    if (category) {
        setCurrentFilter(category);
        updateFilterButtons(category);
        updateProductDisplay();
    }
    
    console.log(`📄 Showing Shop page${category ? ` with filter: ${category}` : ''}`);
}

export function showAdmin() {
    // Check if user is admin first
    const isAdmin = sessionStorage.getItem('gh_admin_session') === 'authenticated';
    if (!isAdmin) {
        showAdminModal();
        return;
    }
    
    setActiveView('admin');
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('shopPage').classList.add('hidden');
    document.getElementById('adminPage').classList.remove('hidden');
    
    // Update active navigation
    updateActiveNavigation('admin');
    
    // Load admin data
    loadAdminData();
    
    console.log('📄 Showing Admin page');
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

export function showAdminModal() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const adminModal = document.getElementById('adminModal');
    const adminPassword = document.getElementById('adminPassword');
    
    if (modalBackdrop) modalBackdrop.style.display = 'block';
    if (adminModal) adminModal.style.display = 'block';
    if (adminPassword) {
        adminPassword.focus();
        adminPassword.value = '';
    }
    
    console.log('🔐 Admin modal shown');
}

export function closeAdminModal() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const adminModal = document.getElementById('adminModal');
    const adminPassword = document.getElementById('adminPassword');
    
    if (modalBackdrop) modalBackdrop.style.display = 'none';
    if (adminModal) adminModal.style.display = 'none';
    if (adminPassword) adminPassword.value = '';
    
    console.log('🔐 Admin modal closed');
}

export function showCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('open');
        updateCartContent();
    }
    
    console.log('🛒 Cart modal shown');
}

export function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('open');
    }
    
    console.log('🛒 Cart modal closed');
}

export function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    
    console.log('💳 Checkout modal closed');
}

export function showTracking() {
    const trackingModal = document.getElementById('trackingModal');
    if (trackingModal) {
        trackingModal.style.display = 'flex';
    }
    
    // Hide any previous results
    const trackingResult = document.getElementById('trackingResult');
    if (trackingResult) {
        trackingResult.classList.add('hidden');
    }
    
    console.log('📦 Tracking modal shown');
}

export function closeTracking() {
    const trackingModal = document.getElementById('trackingModal');
    const trackingResult = document.getElementById('trackingResult');
    
    if (trackingModal) trackingModal.style.display = 'none';
    if (trackingResult) trackingResult.classList.add('hidden');
    
    console.log('📦 Tracking modal closed');
}

// ============================================================================
// DATA MANAGEMENT FUNCTIONS
// ============================================================================

export function clearAllData() {
    const confirmMessage = 'This will clear all cart items and local order history. Are you sure?';
    if (confirm(confirmMessage)) {
        // Clear cart
        setCart([]);
        
        // Clear orders
        setOrders([]);
        
        // Reset order counter
        localStorage.setItem('orderCounter', '1000');
        
        // Update UI
        updateCartUI();
        updateOrderDisplay();
        updateAdminStatsDisplay();
        
        showNotification('All local data cleared successfully', 'info');
        console.log('🗑️ All local data cleared');
    }
}

export function clearAllLocalData() {
    clearAllData();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function updateActiveNavigation(activePage) {
    // Update navigation button states
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current page button
    const activeBtn = document.querySelector(`[onclick*="show${activePage.charAt(0).toUpperCase() + activePage.slice(1)}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function initializeSearch() {
    // Import and call search initialization
    import('./products.js').then(products => {
        products.initializeSearch();
    }).catch(error => {
        console.warn('⚠️ Could not initialize search:', error);
    });
}

function updateFilterButtons(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category.replace('-', ' '))) {
            btn.classList.add('active');
        }
    });
}

function updateProductDisplay() {
    // Import and call products display update
    import('./products.js').then(products => {
        products.updateProductDisplay();
    }).catch(error => {
        console.warn('⚠️ Could not update product display:', error);
    });
}

function updateCartContent() {
    // Import and call cart content update
    import('./cart.js').then(cart => {
        cart.updateCartContent();
    }).catch(error => {
        console.warn('⚠️ Could not update cart content:', error);
    });
}

function updateCartUI() {
    // Import and call cart UI update
    import('./cart.js').then(cart => {
        cart.updateCartUI();
    }).catch(error => {
        console.warn('⚠️ Could not update cart UI:', error);
    });
}

function updateOrderDisplay() {
    // Import and call orders display update
    import('./orders.js').then(orders => {
        // Update order count if element exists
        const orderCount = document.getElementById('orderCount');
        if (orderCount) {
            orderCount.textContent = orders.orders?.length || 0;
        }
    }).catch(error => {
        console.warn('⚠️ Could not update order display:', error);
    });
}

function updateAdminStatsDisplay() {
    // Import and call admin stats update
    import('./admin.js').then(admin => {
        admin.loadAdminStats();
    }).catch(error => {
        console.warn('⚠️ Could not update admin stats:', error);
    });
}

function loadAdminData() {
    // Import and call admin data loading
    import('./admin.js').then(admin => {
        admin.loadAdminData();
    }).catch(error => {
        console.warn('⚠️ Could not load admin data:', error);
    });
}