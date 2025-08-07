// config.js - Application configuration and constants

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
    PROXY_URL: 'https://ghhomegoods.com/api/proxy.php',
    PROXY_HEALTH_URL: 'https://ghhomegoods.com/api/proxy.php?health=1',
    GOOGLE_SHEETS_CSV_URL: 'https://docs.google.com/spreadsheets/d/14yjMXMc3AliGRemAPHU0GKPEBhW9h6Dzu6zv3kPC_fg/export?format=csv&gid=0',
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxejTUnbE2sDmJxmdtwb-p-Uj6c973U9Y3YNR0TuWQ9Uml2429Sq7_NLhbksA2VnyM6/exec'
};

// ============================================================================
// ADMIN CONFIGURATION
// ============================================================================

export const ADMIN_CONFIG = {
    PASSWORD: 'GHAdmin2025!', // ⚠️ In production, move this to environment variables
    SESSION_KEY: 'gh_admin_session',
    SESSION_VALUE: 'authenticated'
};

// ============================================================================
// APPLICATION SETTINGS
// ============================================================================

export const APP_CONFIG = {
    APP_NAME: 'GHHomegoods E-commerce',
    VERSION: '1.0.0',
    COMPANY_NAME: 'GHHomegoods',
    SUPPORT_EMAIL: 'support@ghhomegoods.com',
    SUPPORT_PHONE: '+233-XX-XXX-XXXX'
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
    CART: 'gh_cart',
    ORDERS: 'gh_orders',
    ORDER_COUNTER: 'orderCounter',
    ACTIVE_VIEW: 'activeView',
    ADMIN_SESSION: 'gh_admin_session'
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI_CONFIG = {
    NOTIFICATION_DURATION: 4000, // 4 seconds
    LOADING_DELAY: 500, // 500ms
    SEARCH_DEBOUNCE: 300, // 300ms
    ANIMATION_DURATION: 300 // 300ms
};

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================

export const PRODUCT_CATEGORIES = [
    { id: 'all', name: 'All Products' },
    { id: 'baby-care', name: 'Baby Care' },
    { id: 'food-beverages', name: 'Food & Beverages' },
    { id: 'cleaning-household', name: 'Cleaning & Household' },
    { id: 'personal-care', name: 'Personal Care' },
    { id: 'storage-organization', name: 'Storage & Organization' },
    { id: 'back-to-school', name: 'Back to School' }
];

// ============================================================================
// ORDER STATUSES
// ============================================================================

export const ORDER_STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// ============================================================================
// DELIVERY OPTIONS
// ============================================================================

export const DELIVERY_OPTIONS = [
    {
        id: 'pickup',
        name: 'Store Pickup',
        description: 'Pick up from our store',
        cost: 0,
        estimatedTime: 'Same day'
    },
    {
        id: 'delivery',
        name: 'Home Delivery',
        description: 'Delivery to your address',
        cost: 10,
        estimatedTime: '1-2 business days'
    }
];

// ============================================================================
// FALLBACK PRODUCTS (used when API fails)
// ============================================================================

export const FALLBACK_PRODUCTS = [
    {
        id: 'FB001',
        name: 'Premium Headphones',
        price: 89.99,
        category: 'electronics',
        description: 'High-quality wireless headphones with noise cancellation',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        stock: 15,
        featured: true
    },
    {
        id: 'FB002',
        name: 'Smart Watch',
        price: 199.99,
        category: 'electronics',
        description: 'Advanced fitness tracking smartwatch',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        stock: 8,
        featured: true
    },
    {
        id: 'FB003',
        name: 'Organic Coffee Beans',
        price: 24.99,
        category: 'home-garden',
        description: 'Premium organic coffee beans from Ghana',
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
        stock: 25,
        featured: false
    },
    {
        id: 'FB004',
        name: 'Yoga Mat',
        price: 39.99,
        category: 'sports-outdoors',
        description: 'Non-slip premium yoga mat',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        stock: 12,
        featured: false
    },
    {
        id: 'FB005',
        name: 'Skincare Set',
        price: 59.99,
        category: 'health-beauty',
        description: 'Complete natural skincare routine set',
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
        stock: 18,
        featured: true
    }
];

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
    REQUIRED_FIELDS: {
        CHECKOUT: ['customerName', 'customerPhone', 'fulfillmentMethod'],
        DELIVERY: ['deliveryAddress']
    },
    PATTERNS: {
        PHONE: /^[+]?[\d\s\-\(\)]+$/,
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    LENGTHS: {
        MIN_NAME: 2,
        MAX_NAME: 50,
        MIN_PHONE: 8,
        MAX_PHONE: 15
    }
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    INVALID_DATA: 'Invalid data provided. Please check your input.',
    UNAUTHORIZED: 'Unauthorized access. Please login again.',
    PRODUCT_NOT_FOUND: 'Product not found.',
    OUT_OF_STOCK: 'Product is out of stock.',
    CART_EMPTY: 'Your cart is empty.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    INVALID_EMAIL: 'Please enter a valid email address.'
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
    ORDER_PLACED: 'Order placed successfully! You will receive a confirmation shortly.',
    PRODUCT_ADDED: 'Product added to cart successfully.',
    PRODUCT_REMOVED: 'Product removed from cart.',
    CART_UPDATED: 'Cart updated successfully.',
    DATA_SAVED: 'Data saved successfully.',
    LOGIN_SUCCESS: 'Login successful.',
    LOGOUT_SUCCESS: 'Logged out successfully.'
};

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

export const ENV = {
    IS_DEVELOPMENT: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    IS_PRODUCTION: window.location.hostname === 'ghhomegoods.com',
    IS_STAGING: window.location.hostname.includes('staging')
};

// ============================================================================
// DEBUGGING
// ============================================================================

export const DEBUG = {
    ENABLED: ENV.IS_DEVELOPMENT,
    LOG_LEVELS: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    },
    CURRENT_LEVEL: ENV.IS_DEVELOPMENT ? 3 : 1
};

// ============================================================================
// EXPORT ALL CONFIGURATIONS
// ============================================================================

export default {
    API_CONFIG,
    ADMIN_CONFIG,
    APP_CONFIG,
    STORAGE_KEYS,
    UI_CONFIG,
    PRODUCT_CATEGORIES,
    ORDER_STATUSES,
    DELIVERY_OPTIONS,
    FALLBACK_PRODUCTS,
    VALIDATION_RULES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ENV,
    DEBUG
};