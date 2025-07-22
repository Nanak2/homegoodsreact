// main.js - Application bootstrap and global function bindings

import { initializeState, showNotification } from './utils.js';
import { adminLogin, adminLogout, testConnection, testProxyHealth } from './admin.js';

// ============================================================================
// GLOBAL FUNCTION BINDINGS
// ============================================================================

// This function will be called once other modules are loaded
export function bindGlobalFunctions() {
    // Import navigation functions dynamically to avoid circular imports
    import('./navigation.js').then(nav => {
        // Bind navigation functions to window
        window.showHome = nav.showHome;
        window.showShop = nav.showShop;
        window.showCart = nav.showCart;
        window.closeCart = nav.closeCart;
        window.showAdmin = nav.showAdmin;
        window.showTracking = nav.showTracking;
        window.closeTracking = nav.closeTracking;
        window.showAdminModal = nav.showAdminModal;
        window.closeAdminModal = nav.closeAdminModal;
        window.clearAllData = nav.clearAllData;
        window.clearAllLocalData = nav.clearAllLocalData;
        window.closeCheckout = nav.closeCheckout;
        
        console.log('✅ Navigation functions bound to window');
    }).catch(error => {
        console.error('❌ Failed to load navigation module:', error);
        showNotification('Failed to load navigation functions', 'error');
    });
    
    // Import cart functions
    import('./cart.js').then(cart => {
        window.addToCart = cart.addToCart;
        window.removeFromCart = cart.removeFromCart;
        window.updateQuantity = cart.updateQuantity;
        window.proceedToCheckout = cart.proceedToCheckout;
        
        console.log('✅ Cart functions bound to window');
    }).catch(error => {
        console.error('❌ Failed to load cart module:', error);
    });
    
    // Import product functions
    import('./products.js').then(products => {
        window.refreshProducts = products.refreshProducts;
        window.searchProducts = products.searchProducts;
        window.filterProducts = products.filterProducts;
        
        console.log('✅ Product functions bound to window');
    }).catch(error => {
        console.error('❌ Failed to load products module:', error);
    });
    
    // Import order functions
    import('./orders.js').then(orders => {
        window.placeOrder = orders.placeOrder;
        window.trackOrder = orders.trackOrder;
        
        console.log('✅ Order functions bound to window');
    }).catch(error => {
        console.error('❌ Failed to load orders module:', error);
    });
    
    // Bind admin functions to window
    window.adminLogin = adminLogin;
    window.adminLogout = adminLogout;
    window.testConnection = testConnection;
    window.testProxyHealth = testProxyHealth;
    
    // Import and bind additional admin functions
    import('./admin.js').then(admin => {
        window.loadAdminData = admin.loadAdminData;
    });
    
    console.log('✅ Admin functions bound to window');
    
    // Bind utility functions
    window.showNotification = showNotification;
    
    console.log('✅ Utility functions bound to window');
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

let isInitialized = false;

export function initializeApp() {
    if (isInitialized) {
        console.log('⚠️ App already initialized, skipping...');
        return;
    }
    
    console.log('🚀 Initializing GHHomegoods E-commerce Application...');
    
    // Initialize shared state
    initializeState();
    console.log('✅ State initialized');
    
    // Bind global functions
    bindGlobalFunctions();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize admin state
    checkAdminSession();
    
    // Load initial data
    loadInitialData();
    
    isInitialized = true;
    console.log('✅ GHHomegoods application fully initialized');
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Esc key to close modals
        if (e.key === 'Escape') {
            const cartModal = document.getElementById('cartModal');
            const checkoutModal = document.getElementById('checkoutModal');
            const trackingModal = document.getElementById('trackingModal');
            const adminModal = document.getElementById('adminModal');
            
            if (cartModal?.classList.contains('open')) {
                window.closeCart?.();
            }
            if (checkoutModal?.style.display === 'flex') {
                window.closeCheckout?.();
            }
            if (trackingModal?.style.display === 'flex') {
                window.closeTracking?.();
            }
            if (adminModal?.style.display === 'block') {
                window.closeAdminModal?.();
            }
        }
        
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            const shopPage = document.getElementById('shopPage');
            if (searchInput && !shopPage?.classList.contains('hidden')) {
                searchInput.focus();
            }
        }
        
        // Ctrl + Shift + A to open admin login
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            console.log('🔐 Admin shortcut triggered');
            window.showAdminModal?.();
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const cartModal = document.getElementById('cartModal');
        const checkoutModal = document.getElementById('checkoutModal');
        const trackingModal = document.getElementById('trackingModal');
        const cartButton = document.querySelector('.cart-button');
        
        if (cartModal?.classList.contains('open') && 
            !cartModal.contains(e.target) && 
            !cartButton?.contains(e.target)) {
            window.closeCart?.();
        }
        
        if (checkoutModal?.style.display === 'flex' && 
            e.target === checkoutModal) {
            window.closeCheckout?.();
        }
        
        if (trackingModal?.style.display === 'flex' && 
            e.target === trackingModal) {
            window.closeTracking?.();
        }
    });
    
    // Admin password enter key
    const adminPassword = document.getElementById('adminPassword');
    if (adminPassword) {
        adminPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.adminLogin?.();
            }
        });
    }
    
    // Modal backdrop click
    const modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            window.closeAdminModal?.();
        });
    }
    
    console.log('✅ Event listeners set up');
}

// ============================================================================
// INITIALIZATION HELPERS
// ============================================================================

function checkAdminSession() {
    const isAdminSession = sessionStorage.getItem('gh_admin_session') === 'authenticated';
    if (isAdminSession) {
        import('./admin.js').then(admin => {
            admin.setAdminMode(true);
        });
    }
}

function loadInitialData() {
    // Load products on startup
    import('./products.js').then(products => {
        products.loadProducts();
    }).catch(error => {
        console.error('❌ Failed to load products on startup:', error);
    });
    
    // Update cart UI
    import('./cart.js').then(cart => {
        cart.updateCartUI();
    }).catch(error => {
        console.error('❌ Failed to update cart UI on startup:', error);
    });
    
    // Show home page by default
    setTimeout(() => {
        window.showHome?.();
    }, 100);
}

// ============================================================================
// START APPLICATION
// ============================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Fallback for cases where DOM is already loaded
if (document.readyState !== 'loading') {
    // Use a small delay to prevent double execution
    setTimeout(() => {
        if (!isInitialized) {
            initializeApp();
        }
    }, 10);
}