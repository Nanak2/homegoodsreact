// products.js - Product management and display

import { 
    products, 
    setProducts, 
    currentFilter, 
    setCurrentFilter,
    searchQuery, 
    setSearchQuery,
    showNotification,
    setLoadingState,
    formatPrice
} from './utils.js';

import { 
    API_CONFIG, 
    FALLBACK_PRODUCTS, 
    PRODUCT_CATEGORIES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
} from './config.js';

// ============================================================================
// PRODUCT LOADING
// ============================================================================

export async function loadProducts() {
    console.log('📦 Loading products...');
    setLoadingState(true);
    
    try {
        // First try to load from Google Sheets
        const csvData = await fetchProductsFromGoogleSheets();
        if (csvData && csvData.length > 0) {
            const parsedProducts = parseCSVProducts(csvData);
            if (parsedProducts.length > 0) {
                setProducts(parsedProducts);
                updateProductDisplay();
                console.log(`✅ Loaded ${parsedProducts.length} products from Google Sheets`);
                setLoadingState(false);
                return;
            }
        }
        
        // Fallback to predefined products
        console.log('⚠️ Using fallback products');
        setProducts(FALLBACK_PRODUCTS);
        updateProductDisplay();
        showNotification('Using offline product catalog', 'warning');
        
    } catch (error) {
        console.error('💥 Error loading products:', error);
        setProducts(FALLBACK_PRODUCTS);
        updateProductDisplay();
        showNotification('Failed to load latest products, using offline catalog', 'error');
    } finally {
        setLoadingState(false);
    }
}

export async function refreshProducts() {
    console.log('🔄 Manually refreshing products...');
    showNotification('Refreshing products from Google Sheets...', 'info');
    setLoadingState(true);
    
    try {
        // Force reload from Google Sheets
        const csvData = await fetchProductsFromGoogleSheets();
        if (csvData && csvData.length > 0) {
            const parsedProducts = parseCSVProducts(csvData);
            if (parsedProducts.length > 0) {
                setProducts(parsedProducts);
                updateProductDisplay();
                showNotification(`✅ Refreshed! Loaded ${parsedProducts.length} products from Google Sheets`, 'success');
                console.log(`✅ Manual refresh successful: ${parsedProducts.length} products loaded`);
                return true;
            }
        }
        
        // If Google Sheets fails, keep current products but show warning
        showNotification('Failed to refresh from Google Sheets, keeping current products', 'warning');
        return false;
        
    } catch (error) {
        console.error('💥 Manual refresh failed:', error);
        showNotification('Refresh failed. Check your internet connection.', 'error');
        return false;
    } finally {
        setLoadingState(false);
    }
}

// ============================================================================
// PRODUCT DATA FETCHING
// ============================================================================

async function fetchProductsFromGoogleSheets() {
    try {
        const response = await fetch(API_CONFIG.GOOGLE_SHEETS_CSV_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching products from Google Sheets:', error);
        return null;
    }
}

function parseCSVProducts(csvData) {
    try {
        const lines = csvData.trim().split('\n');
        if (lines.length < 2) return [];
        
        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
        const products = [];
        
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseCSVLine(lines[i]);
                if (values.length < headers.length) continue;
                
                const product = {
                    id: values[headers.indexOf('id')] || `PROD_${i}`,
                    name: values[headers.indexOf('name')] || 'Unnamed Product',
                    price: parseFloat(values[headers.indexOf('price')]) || 0,
                    category: values[headers.indexOf('category')] || 'general',
                    description: values[headers.indexOf('description')] || '',
                   imageUrl: fixImageUrl(values[headers.indexOf('image_url')]) || '',

                    stock: parseInt(values[headers.indexOf('stock')]) || 0,
                    featured: values[headers.indexOf('featured')]?.toLowerCase() === 'true'
                };
                
                if (product.name && product.price > 0) {
                    products.push(product);
                }
            } catch (parseError) {
                console.warn(`⚠️ Error parsing product row ${i}:`, parseError);
            }
        }
        
        return products;
    } catch (error) {
        console.error('💥 CSV parsing error:', error);
        return [];
    }
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i += 2;
                continue;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
        i++;
    }
    
    values.push(current.trim().replace(/^"|"$/g, ''));
    return values;
}

function fixImageUrl(url) {
    if (!url || typeof url !== 'string') return 'https://via.placeholder.com/400x300?text=No+Image';

    // Accept both full URLs and direct file IDs
    const fullMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([-a-zA-Z0-9_]+)/);
    const idFromFullUrl = fullMatch?.[1];

    const looseMatch = url.match(/[-\w]{25,}/)?.[0];

    const fileId = idFromFullUrl || looseMatch;

    return fileId 
        ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w800` 
        : 'https://via.placeholder.com/400x300?text=No+Image';
}





// ============================================================================
// PRODUCT DISPLAY
// ============================================================================

export function updateProductDisplay() {
    const productGrid = document.getElementById('productGrid');
    const searchResults = document.getElementById('searchResults');
    
    if (!productGrid) {
        console.error('Product grid element not found');
        return;
    }
    
    // Filter products
    const filteredProducts = filterProductList(products, currentFilter, searchQuery);
    
    // Update search results text
    updateSearchResults(filteredProducts.length);
    
    // Render products
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500 text-lg">No products found</p>
                <p class="text-gray-400">Try adjusting your search or filter</p>
            </div>
        `;
    } else {
        productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

function filterProductList(productList, filter, search) {
    let filtered = [...productList];
    
    // Apply category filter
    if (filter && filter !== 'all') {
        filtered = filtered.filter(product => 
            product.category && product.category.toLowerCase() === filter.toLowerCase()
        );
    }
    
    // Apply search filter
    if (search && search.trim()) {
        const searchLower = search.toLowerCase().trim();
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower)
        );
    }
    
    return filtered;
}

function createProductCard(product) {
    const isOutOfStock = product.stock <= 0;
    const imageUrl = product.imageUrl; // it's already fixed during parsing

    return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative">
                <img src="${imageUrl}" 
                     alt="${product.name}" 
                     class="w-full h-48 object-cover"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Image+Unavailable'">
                ${product.featured ? '<div class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs rounded">Featured</div>' : ''}
                ${isOutOfStock ? '<div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">Out of Stock</div>' : ''}
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-orange-600">${formatPrice(product.price)}</span>
                    <button onclick="addToCart('${product.id}')" 
                            class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
                ${product.stock > 0 && product.stock <= 5 ? `<p class="text-orange-500 text-xs mt-2">Only ${product.stock} left in stock!</p>` : ''}
            </div>
        </div>
    `;
}


function updateSearchResults(count) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    let message = `Showing ${count} product${count !== 1 ? 's' : ''}`;
    
    if (searchQuery.trim()) {
        message += ` for "${searchQuery}"`;
    }
    
    if (currentFilter !== 'all') {
        const category = PRODUCT_CATEGORIES.find(cat => cat.id === currentFilter);
        message += ` in ${category ? category.name : currentFilter.replace('-', ' ')}`;
    }
    
    searchResults.textContent = message;
}

// ============================================================================
// SEARCH AND FILTERING
// ============================================================================

export function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Set up search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            setSearchQuery(e.target.value);
            updateProductDisplay();
        }, 300));
    }
    
    // Set up filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter') || 'all';
            setCurrentFilter(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            updateProductDisplay();
        });
    });
    
    console.log('🔍 Search initialized');
}

export function searchProducts(query) {
    setSearchQuery(query);
    updateProductDisplay();
}

export function filterProducts(category) {
    setCurrentFilter(category);
    updateProductDisplay();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}



// ============================================================================
// DEBUG FUNCTIONS
// ============================================================================

/**
 * Debug Google Sheets loading - call from console
 */
window.debugGoogleSheets = async function() {
    console.log('🔧 DEBUG: Testing Google Sheets connection...');
    
    try {
        console.log('📋 Google Sheets URL:', API_CONFIG.GOOGLE_SHEETS_CSV_URL);
        
        const csvData = await fetchProductsFromGoogleSheets();
        if (csvData) {
            console.log('✅ CSV Data Length:', csvData.length);
            console.log('📄 First 200 characters:', csvData.substring(0, 200));
            
            const parsedProducts = parseCSVProducts(csvData);
            console.log('📦 Parsed Products:', parsedProducts.length);
            
            if (parsedProducts.length > 0) {
                console.log('🔍 Sample Product:', parsedProducts[0]);
                return { success: true, products: parsedProducts };
            } else {
                console.warn('⚠️ No products parsed from CSV');
                return { success: false, error: 'No products parsed' };
            }
        } else {
            console.error('❌ No CSV data received');
            return { success: false, error: 'No CSV data' };
        }
    } catch (error) {
        console.error('💥 Debug failed:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Force load products from Google Sheets - call from console
 */
window.forceLoadFromSheets = async function() {
    console.log('🚀 FORCE LOADING from Google Sheets...');
    showNotification('Force loading from Google Sheets...', 'info');
    
    const result = await window.debugGoogleSheets();
    if (result.success) {
        setProducts(result.products);
        updateProductDisplay();
        showNotification(`✅ Force loaded ${result.products.length} products!`, 'success');
    } else {
        showNotification(`❌ Force load failed: ${result.error}`, 'error');
    }
    return result;
};

// ============================================================================
// EXPORTS
// ============================================================================

;
function getProductById(id) {
    return products.find(p => p.id === id);
}

export { products, getProductById };
