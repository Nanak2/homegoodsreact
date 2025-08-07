// Shop.js
import React from 'react';

export default function Shop() {
    return (
        <div id="shopPage" class="hidden">
                <h2 class="section-title">All Products</h2>
                
                {/* Search Section */}
                <div class="search-section">
                    <div class="search-container">
                        <input type="text" class="search-input" id="searchInput" placeholder="🔍 Search products... (Press Ctrl+K to focus)" />
                        <div class="search-filters">
                            <button class="filter-btn active" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="baby-care">Baby Care</button>
                            <button class="filter-btn" data-filter="food-beverages">Food & Beverages</button>
                            <button class="filter-btn" data-filter="cleaning-household">Cleaning</button>
                            <button class="filter-btn" data-filter="personal-care">Personal Care</button>
                            <button class="filter-btn" data-filter="storage-organization">Storage</button>
                            <button class="filter-btn" data-filter="back-to-school">Back to School</button> 
                        </div>
                    </div>
                    <div class="search-results" id="searchResults">Showing all products</div>
                </div>
                
                <div class="product-grid" id="productGrid">
                    {/* All products will be loaded here */}
                </div>
            </div>
    );      
};