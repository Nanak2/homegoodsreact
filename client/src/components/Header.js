// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header class="header">
            <div class="header-content">
                {/* Logo and Navigation */}
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img src="/assets/images/logo.png" alt="GHHomegoods Logo" className="logo-image" />
                        <span className="logo-text">Ghhomegoods</span>
                    </Link>
                </div>
                
                <nav class="nav">
                    <ul class="nav-list">
                        <li><button class="nav-button active" id="homeBtn" onclick="showHome()">Home</button></li>
                        <li><button class="nav-button" id="shopBtn" onclick="showShop()">Shop</button></li>
                        <li><button class="nav-button hidden" id="adminBtn" onclick="showAdmin()">Admin (<span id="adminOrderCount">0</span>)</button></li>
                        <li><button class="nav-button hidden" id="logoutBtn" onclick="adminLogout()" style="background-color: rgba(220, 38, 38, 0.2); border: 1px solid rgba(220, 38, 38, 0.5);">Logout</button></li>
                    </ul>
                    
                    <button class="cart-button" onclick="showCart()">
                        Cart
                        <span class="cart-badge hidden" id="cartBadge">
                            <span id="cartCount">0</span>
                        </span>
                    </button>
                </nav>
            </div>
        </header>
    );
};