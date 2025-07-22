function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: 1
                });
            }
            
            updateCartUI();
            showNotification(`Added ${product.name} to cart!`, 'success');
        }
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
            showNotification('Item removed from cart', 'info');
        }
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (!item) return;
            
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartUI();
            }
        }
        function clearCart() {
            if (cart.length === 0) return;
            
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                updateCartUI();
                showNotification('Cart cleared', 'info');
            }
        }
        function getCartTotal() {
            return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        function getCartItemCount() {
            return cart.reduce((total, item) => total + item.quantity, 0);
        }
        function updateCartUI() {
            updateCartBadge();
            updateCartContent();
        }
        function updateCartBadge() {
            const cartBadge = document.getElementById('cartBadge');
            const itemCount = getCartItemCount();
            
            if (itemCount > 0) {
                cartBadge.textContent = itemCount;
                cartBadge.classList.remove('hidden');
            } else {
                cartBadge.classList.add('hidden');
            }
        }
        function updateCartContent() {
            const cartContent = document.getElementById('cartContent');
            if (!cartContent) return;
            
            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started!</p>
                    </div>
                `;
                return;
            }
            
            const cartItemsHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        ${item.imageUrl ? 
                            `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">` :
                            '📦'
                        }
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">GH₵ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            const total = getCartTotal();
            const itemCount = getCartItemCount();
            
            cartContent.innerHTML = `
                ${cartItemsHTML}
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Total (${itemCount} items):</span>
                        <span>GH₵ ${total.toFixed(2)}</span>
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