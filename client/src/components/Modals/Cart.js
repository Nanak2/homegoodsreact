// Cart.js
import React from 'react';

export default function Cart() {
    return (
        <div id="cartModal" class="cart-modal">
            <div class="cart-header">
                <h2>🛒 Shopping Cart</h2>
                <button class="close-cart" onclick="closeCart()">&times;</button>
            </div>
            <div class="cart-content" id="cartContent">
                <div id="emptyCart" class="empty-cart hidden">
                    <div style="text-align: center; padding: 2rem; color: #6b7280;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started!</p>
                        <button class="button" onclick="closeCart(); showShop();">Continue Shopping</button>
                    </div>
                </div>
                <div id="cartItems"></div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: <span id="cartTotal">GH₵0.00</span></strong>
                    </div>
                    <button id="checkoutBtn" class="button" onclick="proceedToCheckout()" disabled>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>  
    );
}