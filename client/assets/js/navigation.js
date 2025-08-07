// navigation.js - Page navigation and UI state management - FIXED

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
    
    // Hide all pages
    const pages = ['homePage', 'shopPage', 'adminPage'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            if (pageId === 'homePage') {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        }
    });
    
    // Update active navigation
    updateActiveNavigation('home');
    
    console.log('📄 Showing Home page');
}

export function showShop(category = null) {
    setActiveView('shop');
    
    // Hide all pages
    const pages = ['homePage', 'shopPage', 'adminPage'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            if (pageId === 'shopPage') {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        }
    });
    
    // Update active navigation
    updateActiveNavigation('shop');
    
    // Initialize search if not already done - ROBUST version
    initializeSearchSafely();
    
    // Apply category filter if provided
    if (category) {
        setCurrentFilter(category);
        updateFilterButtons(category);
        updateProductDisplaySafely();
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
    
    // Hide all pages
    const pages = ['homePage', 'shopPage', 'adminPage'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) {
            if (pageId === 'adminPage') {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        }
    });
    
    // Update active navigation
    updateActiveNavigation('admin');
    
    // Load admin data - ROBUST version
    loadAdminDataSafely();
    
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
        updateCartContentSafely();
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
        
        // Update UI - ROBUST versions
        updateCartUISafely();
        updateOrderDisplaySafely();
        updateAdminStatsDisplaySafely();
        
        showNotification('All local data cleared successfully', 'info');
        console.log('🗑️ All local data cleared');
    }
}

export function clearAllLocalData() {
    clearAllData();
}

// ============================================================================
// ROBUST HELPER FUNCTIONS - Won't fail if modules aren't loaded
// ============================================================================

function updateActiveNavigation(activePage) {
    // Update navigation button states
    const navButtons = document.querySelectorAll('.nav-btn, .nav-button, [class*="nav"]');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current page button - try multiple selectors
    const possibleSelectors = [
        `[onclick*="show${activePage.charAt(0).toUpperCase() + activePage.slice(1)}"]`,
        `#${activePage}Btn`,
        `#${activePage}Button`,
        `.${activePage}-btn`
    ];
    
    for (const selector of possibleSelectors) {
        const activeBtn = document.querySelector(selector);
        if (activeBtn) {
            activeBtn.classList.add('active');
            break;
        }
    }
}

function initializeSearchSafely() {
    // ROBUST: Try to initialize search, but don't fail if products.js isn't loaded
    if (window.initializeSearch && typeof window.initializeSearch === 'function') {
        // Use global function if available
        try {
            window.initializeSearch();
            console.log('✅ Search initialized via global function');
        } catch (error) {
            console.warn('⚠️ Global search initialization failed:', error);
        }
    } else {
        // Try dynamic import as fallback
        import('./products.js').then(products => {
            if (products.initializeSearch) {
                products.initializeSearch();
                console.log('✅ Search initialized via import');
            }
        }).catch(error => {
            console.warn('⚠️ Could not initialize search:', error);
            // Graceful fallback - basic search setup
            const searchInput = document.getElementById('searchInput');
            if (searchInput && !searchInput.hasAttribute('data-initialized')) {
                searchInput.setAttribute('data-initialized', 'true');
                console.log('✅ Basic search fallback initialized');
            }
        });
    }
}

function updateFilterButtons(category) {
    const filterButtons = document.querySelectorAll('.filter-btn, .filter-button, [class*="filter"]');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent.toLowerCase().trim();
        const categoryMatch = category.replace('-', ' ').toLowerCase();
        
        if (btnText.includes(categoryMatch) || btnText === 'all' && category === 'all') {
            btn.classList.add('active');
        }
    });
}

function updateProductDisplaySafely() {
    // ROBUST: Try multiple approaches to update product display
    if (window.updateProductDisplay && typeof window.updateProductDisplay === 'function') {
        try {
            window.updateProductDisplay();
            console.log('✅ Products updated via global function');
            return;
        } catch (error) {
            console.warn('⚠️ Global product update failed:', error);
        }
    }
    
    if (window.filterProducts && typeof window.filterProducts === 'function') {
        try {
            window.filterProducts(currentFilter);
            console.log('✅ Products filtered via global function');
            return;
        } catch (error) {
            console.warn('⚠️ Global product filter failed:', error);
        }
    }
    
    // Dynamic import fallback
    import('./products.js').then(products => {
        if (products.updateProductDisplay) {
            products.updateProductDisplay();
        } else if (products.filterProducts) {
            products.filterProducts(currentFilter);
        }
        console.log('✅ Products updated via import');
    }).catch(error => {
        console.warn('⚠️ Could not update product display:', error);
    });
}

function updateCartContentSafely() {
    // ROBUST: Try multiple approaches to update cart
    if (window.updateCartContent && typeof window.updateCartContent === 'function') {
        try {
            window.updateCartContent();
            console.log('✅ Cart content updated via global function');
            return;
        } catch (error) {
            console.warn('⚠️ Global cart update failed:', error);
        }
    }
    
    // Dynamic import fallback
    import('./cart.js').then(cart => {
        if (cart.updateCartContent) {
            cart.updateCartContent();
            console.log('✅ Cart content updated via import');
        }
    }).catch(error => {
        console.warn('⚠️ Could not update cart content:', error);
        // Basic fallback - show cart count from localStorage
        const cartCount = document.querySelector('.cart-count, #cartCount');
        if (cartCount) {
            try {
                const storedCart = JSON.parse(localStorage.getItem('gh_cart') || '[]');
                cartCount.textContent = storedCart.length;
            } catch (e) {
                cartCount.textContent = '0';
            }
        }
    });
}

function updateCartUISafely() {
    if (window.updateCartUI && typeof window.updateCartUI === 'function') {
        try {
            window.updateCartUI();
            return;
        } catch (error) {
            console.warn('⚠️ Global cart UI update failed:', error);
        }
    }
    
    import('./cart.js').then(cart => {
        if (cart.updateCartUI) {
            cart.updateCartUI();
        }
    }).catch(error => {
        console.warn('⚠️ Could not update cart UI:', error);
    });
}

function updateOrderDisplaySafely() {
    if (window.loadOrdersFromBackend && typeof window.loadOrdersFromBackend === 'function') {
        try {
            window.loadOrdersFromBackend();
            return;
        } catch (error) {
            console.warn('⚠️ Global order update failed:', error);
        }
    }
    
    import('./orders.js').then(orders => {
        const orderCount = document.getElementById('orderCount');
        if (orderCount) {
            orderCount.textContent = orders.orders?.length || 0;
        }
    }).catch(error => {
        console.warn('⚠️ Could not update order display:', error);
        // Basic fallback
        const orderCount = document.getElementById('orderCount');
        if (orderCount) {
            try {
                const storedOrders = JSON.parse(localStorage.getItem('gh_orders') || '[]');
                orderCount.textContent = storedOrders.length;
            } catch (e) {
                orderCount.textContent = '0';
            }
        }
    });
}

function updateAdminStatsDisplaySafely() {
    if (window.loadAdminData && typeof window.loadAdminData === 'function') {
        try {
            window.loadAdminData();
            return;
        } catch (error) {
            console.warn('⚠️ Global admin update failed:', error);
        }
    }
    
    import('./admin.js').then(admin => {
        if (admin.loadAdminStats) {
            admin.loadAdminStats();
        }
    }).catch(error => {
        console.warn('⚠️ Could not update admin stats:', error);
    });
}

function loadAdminDataSafely() {
    if (window.loadAdminData && typeof window.loadAdminData === 'function') {
        try {
            window.loadAdminData();
            console.log('✅ Admin data loaded via global function');
            return;
        } catch (error) {
            console.warn('⚠️ Global admin load failed:', error);
        }
    }
    
    import('./admin.js').then(admin => {
        if (admin.loadAdminData) {
            admin.loadAdminData();
            console.log('✅ Admin data loaded via import');
        }
    }).catch(error => {
        console.warn('⚠️ Could not load admin data:', error);
        showNotification('Admin panel may have limited functionality', 'warning');
    });
}

// ============================================================================
// EXPORTS
// ============================================================================

console.log('🧭 Navigation module loaded with robust error handling');