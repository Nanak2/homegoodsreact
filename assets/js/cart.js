// cart.js - FIXED - All syntax errors resolved

import { 
    cart, 
    setCart, 
    showNotification,
    formatPrice
} from './utils.js';

import { ERROR_MESSAGES } from './config.js';

// ============================================================================
// CHECKOUT FUNCTIONALITY - FIXED TO USE ENHANCED CHECKOUT
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
    
    // Show checkout modal with ENHANCED FORM
    showCheckoutModal();
    
    console.log('💳 Proceeding to enhanced checkout');
}

function showCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'flex';
        
        // Import the enhanced checkout function properly
        import('./orders.js').then(ordersModule => {
            if (ordersModule.createEnhancedCheckoutForm) {
                ordersModule.createEnhancedCheckoutForm();
                console.log('✅ Enhanced checkout form loaded');
            } else {
                console.warn('⚠️ Enhanced checkout not available, using basic form');
                populateBasicCheckoutForm();
            }
        }).catch(error => {
            console.error('❌ Failed to load enhanced checkout:', error);
            populateBasicCheckoutForm();
        });
    }
}

// Keep basic form as fallback only
function populateBasicCheckoutForm() {
    const checkoutBody = document.getElementById('checkoutBody');
    if (!checkoutBody) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const orderSummaryHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>GH₵ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutBody.innerHTML = `
        <form id="checkoutForm">
            <div class="checkout-section">
                <h3>📦 Order Summary</h3>
                <div class="order-summary">
                    ${orderSummaryHTML}
                    <div class="order-item total-row">
                        <span><strong>Total (${itemCount} items)</strong></span>
                        <span><strong>GH₵ ${total.toFixed(2)}</strong></span>
                    </div>
                </div>
            </div>
            
            <!-- BASIC CUSTOMER INFO -->
            <div class="checkout-section">
                <h3>📝 Customer Information</h3>
                <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" name="customerName" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone Number *</label>
                    <input type="tel" name="customerPhone" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email (Optional)</label>
                    <input type="email" name="customerEmail" class="form-input">
                </div>
            </div>
            
            <!-- BASIC FULFILLMENT -->
            <div class="checkout-section">
                <h3>🚚 Delivery Information</h3>
                <div class="form-group">
                    <label class="form-label">Delivery Address *</label>
                    <textarea name="deliveryAddress" class="form-input" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Special Instructions</label>
                    <textarea name="specialInstructions" class="form-input" rows="2"></textarea>
                </div>
            </div>
            
            <!-- PLACE ORDER BUTTON -->
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button type="button" class="button-secondary" onclick="closeCheckout()" style="flex: 1;">
                    ← Back to Cart
                </button>
                <button type="button" class="button" onclick="placeOrder()" style="flex: 2;">
                    Place Order
                </button>
            </div>
        </form>
    `;
}

// ============================================================================
// CART UI FUNCTIONS
// ============================================================================

export function updateCartUI() {
    const cartContent = document.getElementById('cartContent');
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button class="button" onclick="closeCart(); showShop();">
                    Continue Shopping
                </button>
            </div>
        `;
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map(createCartItemHTML).join('')}
        </div>
        <div class="cart-summary">
            <div class="cart-total">
                <span>Total: ${formatPrice(total)}</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">
                Proceed to Checkout
            </button>
            <button class="clear-cart-btn" onclick="clearCart()">
                Clear Cart
            </button>
        </div>
    `;
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">${formatPrice(item.price)} each</p>
                ${item.stock <= 5 ? `<p class="stock-warning">Only ${item.stock} left!</p>` : ''}
            </div>
            
            <div class="quantity-controls">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                        class="qty-btn" 
                        ${item.quantity <= 1 ? 'disabled' : ''}>
                    −
                </button>
                
                <span class="qty-display">${item.quantity}</span>
                
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                        class="qty-btn"
                        ${item.quantity >= item.stock ? 'disabled' : ''}>
                    +
                </button>
            </div>
            
            <div class="item-total">
                <p class="total-price">${formatPrice(item.price * item.quantity)}</p>
                <button onclick="removeFromCart('${item.id}')" class="remove-item">
                    Remove
                </button>
            </div>
        </div>
    `;
}

// ============================================================================
// CART MANAGEMENT FUNCTIONS
// ============================================================================

export function addToCart(productId, quantity = 1) {
    console.log(`🛒 Adding to cart: ${productId}, quantity: ${quantity}`);
    
    // Load products to get current stock info
    import('./products.js').then(products => {
        const product = products.getProductById(productId);
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const newQuantity = currentQuantity + quantity;
        
        if (newQuantity > product.stock) {
            showNotification(`Only ${product.stock} items available in stock`, 'warning');
            return;
        }
        
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                stock: product.stock,
                maxStock: product.stock
            });
        }
        
        setCart(cart);
        updateCartUI();
        showNotification(`${product.name} added to cart!`, 'success');
        console.log(`✅ Added ${product.name} to cart successfully`);
    }).catch(error => {
        console.error('❌ Failed to add to cart:', error);
        showNotification('Failed to add item to cart', 'error');
    });
}

export function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        setCart(cart);
        updateCartUI();
        showNotification(`${item.name} removed from cart`, 'info');
    }
}

export function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity > item.maxStock) {
            showNotification(`Only ${item.maxStock} items available`, 'warning');
            return;
        }
        
        item.quantity = newQuantity;
        setCart(cart);
        updateCartUI();
    }
}

export function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        setCart([]);
        updateCartUI();
        showNotification('Cart cleared', 'info');
    }
}

// ============================================================================
// GLOBAL FUNCTION BINDINGS
// ============================================================================

// Make functions available globally for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.updateCartUI = updateCartUI;

console.log('✅ Cart functions bound to window globally');

// ============================================================================
// EXPORTS
// ============================================================================

