// api.js - API communication and backend integration with WORKING CROSS-DEVICE SYNC

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

// ADD THIS: Simple, working proxy URLs (from working single file)
const PROXY_URL = 'https://ghhomegoods.com/api/proxy.php';
const PROXY_HEALTH_URL = 'https://ghhomegoods.com/api/proxy.php?health=1';

// Connection state tracking
let connectionStatus = 'unknown';

// ============================================================================
// CORE API FUNCTIONS - SIMPLIFIED AND WORKING
// ============================================================================

/**
 * CRITICAL: Main API communication function - EXACT implementation from working single file
 * This is the key function that enables cross-device synchronization
 */
export async function callViaProxy(action, data = {}) {
    try {
        console.log(`📡 Proxy API Call: ${action}`, data);
        
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                ...data
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log(`📡 Proxy Response: ${action}`, result);
        
        if (!result.success) {
            throw new Error(result.message || 'API call failed');
        }
        
        updateConnectionStatus('online');
        return result;
        
    } catch (error) {
        console.error(`💥 Proxy API Error (${action}):`, error);
        updateConnectionStatus('offline');
        throw error;
    }
}

/**
 * Test proxy server health - EXACT implementation from working single file
 */
export async function testProxyHealth() {
    try {
        updateConnectionStatus('testing');
        
        // Try the health endpoint first
        try {
            const response = await fetch(PROXY_HEALTH_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const health = await response.json();
                console.log('🏥 Proxy Health Check:', health);
                
                if (health.status === 'healthy') {
                    updateConnectionStatus('online');
                    showNotification('✅ Proxy is healthy and connected to Google Apps Script', 'success');
                    return health;
                }
            }
        } catch (healthError) {
            console.warn('⚠️ Health endpoint failed, testing main proxy...', healthError);
        }
        
        // Fallback: Test main proxy functionality
        const result = await callViaProxy('verify_system');
        
        updateConnectionStatus('online');
        showNotification('✅ Proxy is working! (Health endpoint may be disabled)', 'success');
        return { status: 'healthy', fallback: true };
        
    } catch (error) {
        console.error('💥 Proxy health check failed:', error);
        updateConnectionStatus('offline');
        showNotification(`❌ Proxy connection failed: ${error.message}`, 'error');
        return null;
    }
}

/**
 * Test connection - EXACT implementation from working single file
 */
export async function testConnection() {
    try {
        updateConnectionStatus('testing');
        showNotification('Testing connection via proxy...', 'info');
        
        const result = await callViaProxy('verify_system');
        
        updateConnectionStatus('online');
        showNotification('✅ Proxy connection successful! System is operational.', 'success');
        return true;
        
    } catch (error) {
        updateConnectionStatus('offline');
        showNotification(`❌ Connection test failed: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Update connection status indicator - EXACT implementation from working single file
 */
function updateConnectionStatus(status) {
    connectionStatus = status;
    const statusEl = document.getElementById('connectionStatus');
    
    if (!statusEl) return;
    
    statusEl.className = `connection-status ${status}`;
    
    switch (status) {
        case 'online':
            statusEl.textContent = '🟢 Connected via Proxy';
            statusEl.style.display = 'block';
            setTimeout(() => statusEl.style.display = 'none', 3000);
            break;
        case 'offline':
            statusEl.textContent = '🔴 Connection Failed';
            statusEl.style.display = 'block';
            break;
        case 'testing':
            statusEl.textContent = '🟡 Testing Connection...';
            statusEl.style.display = 'block';
            break;
        default:
            statusEl.style.display = 'none';
    }
}

// ============================================================================
// ENHANCED API FUNCTIONS - Keep your existing functionality
// ============================================================================

/**
 * Enhanced API communication function with your existing features
 */
export async function callViaProxyAdvanced(action, data = {}, options = {}) {
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
    
    console.log(`🌐 API Call (Advanced): ${action}`, DEBUG.ENABLED ? requestData : { action });
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const response = await fetchWithTimeout(PROXY_URL, {
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
            
            console.log(`✅ API Success (Advanced): ${action}`, DEBUG.ENABLED ? result : { success: result.success });
            
            if (showNotifications && result.success) {
                showNotification(`${action} completed successfully`, 'success');
            }
            
            updateConnectionStatus('online');
            return result;
            
        } catch (error) {
            console.warn(`⚠️ API Attempt ${attempt}/${retries + 1} failed:`, error.message);
            
            if (attempt <= retries) {
                await sleep(1000 * attempt); // Exponential backoff
                continue;
            }
            
            // All attempts failed
            console.error(`💥 API Failed (Advanced): ${action}`, error);
            
            if (showNotifications) {
                showNotification(`Failed to ${action.replace('_', ' ')}`, 'error');
            }
            
            updateConnectionStatus('offline');
            throw error;
        }
    }
}

// ============================================================================
// PRODUCT DATA API - Updated to use working callViaProxy
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
        
        // Fallback to proxy using working callViaProxy
        const result = await callViaProxy('get_products');
        
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
 * Direct CSV fetch from Google Sheets - Enhanced
 */
export async function fetchGoogleSheetsCSV() {
    const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/14yjMXMc3AliGRemAPHU0GKPEBhW9h6Dzu6zv3kPC_fg/export?format=csv&gid=0';
    
    try {
        const response = await fetchWithTimeout(GOOGLE_SHEETS_CSV_URL, {
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
        const result = await callViaProxy('refresh_products');
        
        if (result.success) {
            showNotification('Products refreshed successfully', 'success');
        }
        
        return result;
        
    } catch (error) {
        console.error('💥 Failed to refresh product cache:', error);
        showNotification('Failed to refresh products', 'error');
        return { success: false, error: error.message };
    }
}

// ============================================================================
// ORDER MANAGEMENT API - Updated to use working callViaProxy
// ============================================================================

/**
 * Submit order to backend - CRITICAL for cross-device sync
 */
export async function submitOrder(orderData) {
    console.log(`📝 Submitting order #${orderData.id} via working proxy...`);
    
    try {
        // Use the working callViaProxy function
        const result = await callViaProxy('place_order', { order: orderData });
        
        if (result.success) {
            console.log(`✅ Order #${orderData.id} submitted successfully - enables cross-device sync`);
            showNotification('Order saved to server! Visible on all devices.', 'success');
        }
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to submit order #${orderData.id}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Track order by ID and phone - CRITICAL for cross-device tracking
 */
export async function trackOrderById(orderId, phone) {
    console.log(`🔍 Tracking order ${orderId} for phone ${phone}...`);
    
    try {
        // Use the working callViaProxy function
        const result = await callViaProxy('lookup_customer_order', {
            orderId,
            phoneNumber: phone
        });
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to track order ${orderId}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Update order status - CRITICAL for admin cross-device sync
 */
export async function updateOrderStatus(orderId, newStatus, paymentMethod = '', adminNotes = '') {
    console.log(`📋 Updating order ${orderId} status to: ${newStatus}`);
    
    try {
        // Use the working callViaProxy function
        const result = await callViaProxy('update_order_status', {
            orderId,
            status: newStatus,
            paymentMethod,
            adminNotes
        });
        
        if (result.success) {
            console.log(`✅ Order ${orderId} status updated via backend - synced across devices`);
        }
        
        return result;
        
    } catch (error) {
        console.error(`💥 Failed to update order ${orderId} status:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetch all orders for admin dashboard - CRITICAL for cross-device admin
 */
export async function fetchAllOrders() {
    console.log('📊 Fetching all orders for admin...');
    setOrdersLoadingState(true);
    
    try {
        // Use the working callViaProxy function
        const result = await callViaProxy('get_orders', {
            limit: 100,
            status: 'all',
            sortBy: 'date'
        });
        
        if (result.success) {
            console.log(`✅ Fetched ${result.data?.orders?.length || 0} orders from backend`);
        }
        
        return result;
        
    } catch (error) {
        console.error('💥 Failed to fetch orders:', error);
        return { success: false, error: error.message };
    } finally {
        setOrdersLoadingState(false);
    }
}

// ============================================================================
// ADMIN API FUNCTIONS - Updated to use working callViaProxy
// ============================================================================

/**
 * Get admin dashboard statistics
 */
export async function fetchAdminStats() {
    console.log('📈 Fetching admin statistics...');
    
    try {
        // Use the working callViaProxy function
        const result = await callViaProxy('get_admin_stats');
        
        return result;
        
    } catch (error) {
        console.error('💥 Failed to fetch admin stats:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Test Google Apps Script connection - Updated
 */
export async function testGoogleAppsScript() {
    console.log('📊 Testing Google Apps Script connection...');
    
    try {
        // Use the working callViaProxy function
        const result = await callViaProxy('verify_system');
        
        if (result.success) {
            showNotification('Google Apps Script connection successful', 'success');
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Google Apps Script test failed:', error);
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
                healthy: !!health
            };
            
            if (!health) {
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
// DEBUGGING HELPERS - Enhanced
// ============================================================================

/**
 * Debug backend storage - ENHANCED for cross-device testing
 */
export async function debugBackendStorage() {
    console.log('🔧 DEBUG: Testing backend storage integration...');
    
    const tests = [
        {
            name: 'PHP Proxy Health',
            test: () => testProxyHealth(),
            critical: true
        },
        {
            name: 'Google Apps Script Connection',
            test: () => callViaProxy('verify_system'),
            critical: true
        },
        {
            name: 'Order Retrieval (Cross-Device Sync)',
            test: () => callViaProxy('get_orders', { limit: 10 }),
            critical: true
        },
        {
            name: 'Order Tracking Test',
            test: () => callViaProxy('lookup_customer_order', { orderId: 'GH1001', phoneNumber: '0201234567' }),
            critical: false
        },
        {
            name: 'Admin Stats Retrieval',
            test: () => callViaProxy('get_admin_stats'),
            critical: false
        }
    ];
    
    const results = {};
    
    for (const test of tests) {
        try {
            console.log(`🧪 Testing: ${test.name}...`);
            const result = await test.test();
            const working = result && result.success !== false;
            
            results[test.name] = { 
                success: true, 
                data: result,
                working: working,
                critical: test.critical
            };
            console.log(`${working ? '✅' : '❌'} ${test.name}: ${working ? 'Working' : 'Failed'}`);
        } catch (error) {
            results[test.name] = { 
                success: false, 
                error: error.message,
                working: false,
                critical: test.critical
            };
            console.error(`❌ ${test.name}: Failed - ${error.message}`);
        }
    }
    
    console.log('\n📊 BACKEND INTEGRATION SUMMARY:');
    Object.entries(results).forEach(([name, result]) => {
        const icon = result.working ? '✅' : (result.critical ? '🚨' : '⚠️');
        console.log(`${icon} ${name}${result.critical ? ' (CRITICAL)' : ''}`);
    });
    
    const criticalTests = Object.values(results).filter(r => r.critical);
    const workingCritical = criticalTests.filter(r => r.working).length;
    const totalTests = Object.keys(results).length;
    const workingTotal = Object.values(results).filter(r => r.working).length;
    
    console.log(`\n📈 Backend Integration: ${workingTotal}/${totalTests} endpoints working (${workingCritical}/${criticalTests.length} critical)`);
    
    if (workingCritical === 0) {
        console.log('\n🚨 CRITICAL ISSUE: No critical backend endpoints working');
        console.log('💥 IMPACT: Orders only stored locally - NO cross-device sync');
        console.log('💡 SOLUTION: Fix PHP proxy and Google Apps Script setup');
    } else if (workingCritical < criticalTests.length) {
        console.log('\n⚠️ PARTIAL: Some critical endpoints failing');
        console.log('💥 IMPACT: Limited cross-device functionality');
        console.log('💡 SOLUTION: Check failed critical endpoints');
    } else {
        console.log('\n🎉 SUCCESS: All critical endpoints working');
        console.log('✅ RESULT: Full cross-device synchronization enabled');
        console.log('🌐 FEATURE: Orders placed on any device will appear in admin panel');
    }
    
    return results;
}

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

// Make debug functions available globally
window.debugApiConnectivity = debugApiConnectivity;
window.debugBackendStorage = debugBackendStorage;
window.testConnection = testConnection;
window.testProxyHealth = testProxyHealth;

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize API module
console.log('🔌 API module initialized with cross-device sync support');
console.log('📡 Proxy URL:', PROXY_URL);

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
    validateApiResponse,
    updateConnectionStatus,
    connectionStatus,
    PROXY_URL,
    PROXY_HEALTH_URL
};