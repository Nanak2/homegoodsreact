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
    // This will be implemented when we fix products.js
    // For now, just log that search should be initialized
    console.log('🔍 Search should be initialized here');
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
    // This will be implemented when we fix products.js
    console.log('📦 Products should be updated here');
}

function updateCartContent() {
    // This will be implemented when we fix cart.js
    console.log('🛒 Cart content should be updated here');
}

function updateCartUI() {
    // This will be implemented when we fix cart.js
    console.log('🛒 Cart UI should be updated here');
}

function updateOrderDisplay() {
    // This will be implemented when we fix orders.js
    console.log('📋 Orders display should be updated here');
}

function updateAdminStatsDisplay() {
    // This will be implemented when we fix admin.js
    console.log('📊 Admin stats should be updated here');
}

function loadAdminData() {
    // This will be implemented when we fix admin.js
    console.log('👑 Admin data should be loaded here');
}