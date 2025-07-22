// cart.js - Shopping cart management

import { 
    cart, 
    setCart, 
    products,
    showNotification,
    formatPrice
} from './utils.js';

import { 
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    DELIVERY_OPTIONS
} from './config.js';

// ============================================================================
// CART MANAGEMENT
// ============================================================================

export function addToCart(productId, quantity = 1) {
    const product = findProductById(productId);
    if (!product) {
        showNotification(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 'error');
        return false;
    }
    
    // Check stock
    if (product.stock <= 0) {
        showNotification(ERROR_MESSAGES.OUT_OF_STOCK, 'error');
        return false;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Check if adding quantity would exceed stock
        if (existingItem.quantity + quantity > product.stock) {
            showNotification(`Only ${product.stock} items available in stock`, 'warning');
            return false;
        }
        existingItem.quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity,
            maxStock: product.stock
        });
    }
    
    setCart(cart);
    updateCartUI();
    showNotification(SUCCESS_MESSAGES.PRODUCT_ADDED, 'success');
    
    console.log(`🛒 Added ${quantity}x ${product.name} to cart`);
    return true;
}

export function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) {
        showNotification(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 'error');
        return false;
    }
    
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    
    setCart(cart);
    updateCartUI();
    showNotification(SUCCESS_MESSAGES.PRODUCT_REMOVED, 'success');
    
    console.log(`🗑️ Removed ${removedItem.name} from cart`);
    return true;
}

export function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) {
        showNotification(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 'error');
        return false;
    }
    
    if (newQuantity <= 0) {
        return removeFromCart(productId);
    }
    
    // Check stock limit
    if (newQuantity > item.maxStock) {
        showNotification(`Only ${item.maxStock} items available`, 'warning');
        return false;
    }
    
    item.quantity = newQuantity;
    setCart(cart);
    updateCartUI();
    showNotification(SUCCESS_MESSAGES.CART_UPDATED, 'success');
    
    console.log(`📝 Updated ${item.name} quantity to ${newQuantity}`);
    return true;
}

export function clearCart() {
    setCart([]);
    updateCartUI();
    showNotification('Cart cleared', 'info');
    console.log('🗑️ Cart cleared');
}

// ============================================================================
// CART UI MANAGEMENT
// ============================================================================

export function updateCartUI() {
    updateCartBadge();
    updateCartContent();
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    const cartCount = document.getElementById('cartCount');
    
    const totalItems = getTotalItemsInCart();
    
    if (cartBadge) {
        if (totalItems > 0) {
            cartBadge.classList.remove('hidden');
            if (cartCount) {
                cartCount.textContent = totalItems > 99 ? '99+' : totalItems.toString();
            }
        } else {
            cartBadge.classList.add('hidden');
        }
    }
}

export function updateCartContent() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        // Show empty cart state
        if (emptyCart) emptyCart.classList.remove('hidden');
        cartItems.innerHTML = '';
        if (cartTotal) cartTotal.textContent = formatPrice(0);
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        // Show cart items
        if (emptyCart) emptyCart.classList.add('hidden');
        if (checkoutBtn) checkoutBtn.disabled = false;
        
        cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
        
        const total = getCartTotal();
        if (cartTotal) cartTotal.textContent = formatPrice(total);
    }
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item flex items-center gap-4 py-4 border-b" data-product-id="${item.id}">
            <img src="${item.imageUrl || '/api/placeholder/80/80'}" 
                 alt="${item.name}" 
                 class="w-16 h-16 object-cover rounded"
                 onerror="this.src='/api/placeholder/80/80'">
            
            <div class="flex-1">
                <h4 class="font-medium text-gray-900">${item.name}</h4>
                <p class="text-sm text-gray-500">${formatPrice(item.price)}</p>
            </div>
            
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                        class="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50"
                        ${item.quantity <= 1 ? 'disabled' : ''}>
                    −
                </button>
                
                <span class="w-12 text-center font-medium">${item.quantity}</span>
                
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                        class="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50"
                        ${item.quantity >= item.maxStock ? 'disabled' : ''}>
                    +
                </button>
            </div>
            
            <div class="text-right">
                <p class="font-medium">${formatPrice(item.price * item.quantity)}</p>
                <button onclick="removeFromCart('${item.id}')" 
                        class="text-red-500 text-sm hover:text-red-700">
                    Remove
                </button>
            </div>
        </div>
    `;
}

// ============================================================================
// CHECKOUT FUNCTIONALITY
// ============================================================================

export function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification(ERROR_MESSAGES.CART_EMPTY, 'warning');
        return;
    }
    
    // Close cart modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('open');
    }
    
    // Show checkout modal
    showCheckoutModal();
    
    console.log('💳 Proceeding to checkout');
}

function showCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
        populateCheckoutForm();
    }
}

function populateCheckoutForm() {
    // Populate order summary
    const orderItems = document.getElementById('orderItems');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderDelivery = document.getElementById('orderDelivery');
    const orderTotal = document.getElementById('orderTotal');
    
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="flex justify-between py-2">
                <span>${item.name} × ${item.quantity}</span>
                <span>${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }
    
    const subtotal = getCartTotal();
    if (orderSubtotal) orderSubtotal.textContent = formatPrice(subtotal);
    
    // Update delivery cost and total when delivery method changes
    updateOrderTotals();
    
    // Set up delivery method change handler
    const deliveryRadios = document.querySelectorAll('input[name="fulfillmentMethod"]');
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderTotals);
    });
}

function updateOrderTotals() {
    const selectedDelivery = document.querySelector('input[name="fulfillmentMethod"]:checked');
    const orderDelivery = document.getElementById('orderDelivery');
    const orderTotal = document.getElementById('orderTotal');
    const deliveryAddressSection = document.getElementById('deliveryAddressSection');
    
    let deliveryCost = 0;
    
    if (selectedDelivery) {
        const deliveryOption = DELIVERY_OPTIONS.find(option => option.id === selectedDelivery.value);
        if (deliveryOption) {
            deliveryCost = deliveryOption.cost;
        }
        
        // Show/hide delivery address section
        if (deliveryAddressSection) {
            if (selectedDelivery.value === 'delivery') {
                deliveryAddressSection.classList.remove('hidden');
            } else {
                deliveryAddressSection.classList.add('hidden');
            }
        }
    }
    
    const subtotal = getCartTotal();
    const total = subtotal + deliveryCost;
    
    if (orderDelivery) orderDelivery.textContent = formatPrice(deliveryCost);
    if (orderTotal) orderTotal.textContent = formatPrice(total);
}

// ============================================================================
// CART CALCULATIONS
// ============================================================================

export function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getTotalItemsInCart() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartItemCount() {
    return cart.length;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function findProductById(productId) {
    return products.find(product => product.id === productId);
}

// ============================================================================
// GLOBAL FUNCTION BINDINGS
// ============================================================================

// Make functions available globally for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.proceedToCheckout = proceedToCheckout;

// ============================================================================
// EXPORTS
// ============================================================================

export { cart };