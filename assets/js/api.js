// api.js - API communication and backend integration

import { 
    showNotification, 
    setLoadingState,
    setOrdersLoadingState 
} from './utils.js';

import { 
    API_CONFIG, 
    ERROR_MESSAGES,
    DEBUG
} from './config.js';

// ============================================================================
// CORE API FUNCTIONS
// ============================================================================

/**
 * Main API communication function - handles all proxy calls
 */
export async function callViaProxy(action, data = {}, options = {}) {
    const {
        timeout = 10000,
        retries = 2,
        showNotifications = false
    } = options;
    
    const requestData = {
        action,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    console.log(`🌐 API Call: ${action}`, DEBUG.ENABLED ? requestData : { action });
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const response = await fetchWithTimeout(API_CONFIG.PROXY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            }, timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            console.log(`✅ API Success: ${action}`, DEBUG.ENABLED ? result : { success: result.success });
            
            if (showNotifications && result.success) {
                showNotification(`${action} completed successfully`, 'success');
            }
            
            return result;
            
        } catch (error) {
            console.warn(`⚠️ API Attempt ${attempt}/${retries + 1} failed:`, error.message);
            
            if (attempt <= retries) {
                await sleep(1000 * attempt); // Exponential backoff
                continue;
            }
            
            // All attempts failed
            console.error(`💥 API Failed: ${action}`, error);
            
            if (showNotifications) {
                showNotification(`Failed to ${action.replace('_', ' ')}`, 'error');
            }
            
            throw error;
        }
    }
}

/**
 * Test proxy server health
 */
export async function testProxyHealth() {
    console.log('🏥 Testing proxy health...');
    
    try {
        const response = await fetchWithTimeout(API_CONFIG.PROXY_HEALTH_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }, 5000);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        console.log('✅ Proxy health check:', result);
        showNotification('Proxy is healthy and responsive', 'success');
        
        return {
            success: true,
            healthy: true,
            data: result
        };
        
    } catch (error) {
        console.error('❌ Proxy health check failed:', error);
        showNotification('Proxy health check failed', 'error');
        
        return {
            success: false,
            healthy: false,
            error: error.message
        };
    }
}

/**
 * Test connection to Google Apps Script
 */
export async function testGoogleAppsScript() {
    console.log('📊 Testing Google Apps Script connection...');
    
    try {
        const result = await callViaProxy('test_connection', {}, {
            timeout: 8000,
            showNotifications: true
        });
        
        return result;
        
    } catch (error) {
        console.error('❌ Google Apps Script test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ============================================================================
// PRODUCT DATA API
// ============================================================================

/**
 * Fetch products from Google Sheets
 */
export async function fetchProductsFromSheets() {
    console.log('📦 Fetching products from Google Sheets...');
    setLoadingState(true);
    
    try {
        // First try direct CSV fetch
        const csvData = await fetchGoogleSheetsCSV();
        if (csvData) {
            console.log('✅ Products fetched directly from Google Sheets');
            return { success: true, data: csvData, source: 'direct' };
        }
        
        // Fallback to proxy
        const result = await callViaProxy('get_products', {}, {
            timeout: 15000,
            retries: 1
        });
        
        if (result.success && result.products) {
            console.log('✅ Products fetched via proxy');
            return { success: true, data: result.products, source: 'proxy' };
        }
        
        throw new Error('No product data available');
        
    } catch (error) {
        console.error('💥 Failed to fetch products:', error);
        return { success: false, error: error.message };
    } finally {
        setLoadingState(false);
    }
}

/**
 * Direct CSV fetch from Google Sheets
 */
export async function fetchGoogleSheetsCSV() {
    try {
        const response = await fetchWithTimeout(API_CONFIG.GOOGLE_SHEETS_CSV_URL, {
            method: 'GET',
            headers: {
                'Accept': 'text/csv,text/plain,*/*'
            }
        }, 10000);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const csvData = await response.text();
        
        if (csvData.length < 50) { // Sanity check
            throw new Error('CSV data too short, likely invalid');
        }
        
        return csvData;
        
    } catch (error) {
        console.warn('⚠️ Direct CSV fetch failed:', error.message);
        return null;
    }
}

/**
 * Refresh product cache
 */
export async function refreshProductCache() {
    console.log('🔄 Refreshing product cache...');
    
    try {
        const result = await callViaProxy('refresh_products', {}, {
            timeout: 20000,
            showNotifications: true
        });
        
        return result;
        
    } catch (error) {
        console.error('💥 Failed to refresh product cache:', error);
        showNotification('Failed to refresh products', 'error');
        return { success: false, error: error.message };
    }
}

// ============================================================================
// ORDER MANAGEMENT API
// ============================================================================

/**
 * Submit order to backend
 */
export async function submitOrder(orderData) {
    console.log(`📝 Submitting order #${orderData.id}...`);
    
    try {
        const result = await callViaProxy('place_order', {
            order: orderData,
            source: 'web_frontend'
        }, {
            timeout: 15000,
            retries: 2
        });
        
        if (result.success) {
            console.log(`✅ Order #${orderData.id} submitted successfully`);
        }
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to submit order #${orderData.id}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Track order by ID and phone
 */
export async function trackOrderById(orderId, phone) {
    console.log(`🔍 Tracking order ${orderId} for phone ${phone}...`);
    
    try {
        const result = await callViaProxy('track_order', {
            orderId,
            phone,
            includeHistory: true
        }, {
            timeout: 10000,
            retries: 1
        });
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to track order ${orderId}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(orderId, newStatus, adminToken = null) {
    console.log(`📋 Updating order ${orderId} status to: ${newStatus}`);
    
    try {
        const result = await callViaProxy('update_order_status', {
            orderId,
            status: newStatus,
            adminToken,
            timestamp: new Date().toISOString()
        }, {
            timeout: 8000,
            retries: 1
        });
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to update order ${orderId} status:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetch all orders for admin dashboard
 */
export async function fetchAllOrders(adminToken = null) {
    console.log('📊 Fetching all orders for admin...');
    setOrdersLoadingState(true);
    
    try {
        const result = await callViaProxy('get_all_orders', {
            adminToken,
            includeStats: true
        }, {
            timeout: 15000,
            retries: 1
        });
        
        return result;
        
    } catch (error) {
        console.error('💥 Failed to fetch orders:', error);
        return { success: false, error: error.message };
    } finally {
        setOrdersLoadingState(false);
    }
}

// ============================================================================
// ADMIN API FUNCTIONS
// ============================================================================

/**
 * Admin login authentication
 */
export async function authenticateAdmin(password) {
    console.log('🔐 Authenticating admin...');
    
    try {
        const result = await callViaProxy('admin_login', {
            password,
            requestToken: true
        }, {
            timeout: 5000,
            retries: 0 // No retries for auth
        });
        
        return result;
        
    } catch (error) {
        console.error('💥 Admin authentication failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get admin dashboard statistics
 */
export async function fetchAdminStats(adminToken = null) {
    console.log('📈 Fetching admin statistics...');
    
    try {
        const result = await callViaProxy('get_admin_stats', {
            adminToken,
            includeCharts: true,
            dateRange: '30d'
        }, {
            timeout: 12000,
            retries: 1
        });
        
        return result;
        
    } catch (error) {
        console.error('💥 Failed to fetch admin stats:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================================
// NOTIFICATION API
// ============================================================================

/**
 * Send notification (email/SMS) to customer
 */
export async function sendCustomerNotification(orderId, notificationType, customMessage = null) {
    console.log(`📧 Sending ${notificationType} notification for order ${orderId}...`);
    
    try {
        const result = await callViaProxy('send_notification', {
            orderId,
            type: notificationType,
            customMessage,
            source: 'admin_panel'
        }, {
            timeout: 10000,
            retries: 1
        });
        
        if (result.success) {
            showNotification(`${notificationType} notification sent`, 'success');
        }
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to send notification:`, error);
        showNotification('Failed to send notification', 'error');
        return { success: false, error: error.message };
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fetch with timeout support
 */
function fetchWithTimeout(url, options = {}, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);
        
        fetch(url, options)
            .then(response => {
                clearTimeout(timeoutId);
                resolve(response);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate API response structure
 */
function validateApiResponse(response, requiredFields = []) {
    if (!response || typeof response !== 'object') {
        return false;
    }
    
    // Check for success field
    if (typeof response.success !== 'boolean') {
        return false;
    }
    
    // Check required fields
    for (const field of requiredFields) {
        if (!(field in response)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Handle API errors consistently
 */
function handleApiError(error, context = '') {
    let userMessage = ERROR_MESSAGES.NETWORK_ERROR;
    
    if (error.message.includes('timeout')) {
        userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message.includes('HTTP 4')) {
        userMessage = 'Invalid request. Please refresh the page and try again.';
    } else if (error.message.includes('HTTP 5')) {
        userMessage = ERROR_MESSAGES.SERVER_ERROR;
    }
    
    console.error(`💥 API Error${context ? ` (${context})` : ''}:`, error);
    
    return {
        success: false,
        error: error.message,
        userMessage
    };
}

// ============================================================================
// HEALTH MONITORING
// ============================================================================

let lastHealthCheck = null;
let healthCheckInterval = null;

/**
 * Start periodic health monitoring
 */
export function startHealthMonitoring(intervalMs = 60000) {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
    }
    
    healthCheckInterval = setInterval(async () => {
        try {
            const health = await testProxyHealth();
            lastHealthCheck = {
                timestamp: new Date(),
                healthy: health.healthy
            };
            
            if (!health.healthy) {
                console.warn('⚠️ Proxy health check failed during monitoring');
            }
        } catch (error) {
            console.error('💥 Health monitoring error:', error);
        }
    }, intervalMs);
    
    console.log(`💓 Health monitoring started (${intervalMs}ms interval)`);
}

/**
 * Stop health monitoring
 */
export function stopHealthMonitoring() {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
        healthCheckInterval = null;
        console.log('💓 Health monitoring stopped');
    }
}

/**
 * Get last health check result
 */
export function getLastHealthCheck() {
    return lastHealthCheck;
}

// ============================================================================
// DEBUGGING HELPERS
// ============================================================================

/**
 * Debug API connectivity
 */
export async function debugApiConnectivity() {
    console.log('🔧 Running API connectivity debug...');
    
    const tests = [
        {
            name: 'Proxy Health',
            test: () => testProxyHealth()
        },
        {
            name: 'Google Apps Script',
            test: () => testGoogleAppsScript()
        },
        {
            name: 'Google Sheets CSV',
            test: () => fetchGoogleSheetsCSV()
        }
    ];
    
    const results = {};
    
    for (const test of tests) {
        try {
            console.log(`🧪 Testing: ${test.name}...`);
            const result = await test.test();
            results[test.name] = { success: true, data: result };
            console.log(`✅ ${test.name}: Passed`);
        } catch (error) {
            results[test.name] = { success: false, error: error.message };
            console.error(`❌ ${test.name}: Failed`, error.message);
        }
    }
    
    return results;
}

// Make debug function available globally
window.debugApiConnectivity = debugApiConnectivity;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Start health monitoring if enabled
if (DEBUG.ENABLED) {
    console.log('🔧 Debug mode: API monitoring enabled');
    // startHealthMonitoring(30000); // Every 30 seconds in debug mode
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    fetchWithTimeout,
    handleApiError,
    validateApiResponse
};