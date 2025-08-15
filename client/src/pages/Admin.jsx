// Admin.js
import React from 'react';

export default function Admin() {
    return (
        <div id="adminPage" class="hidden">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 class="section-title" style="margin-bottom: 0;">Admin Dashboard</h2>
            </div>
            
            {/* Admin Statistics Section */}
            <div class="admin-stats" id="adminStats">
                <div class="stat-card">
                    <h3>Total Orders</h3>
                    <div class="stat-value" id="totalOrders">0</div>
                </div>
                <div class="stat-card">
                    <h3>Total Revenue</h3>
                    <div class="stat-value" id="totalRevenue">GH₵0.00</div>
                </div>
                <div class="stat-card">
                    <h3>Average Order</h3>
                    <div class="stat-value" id="avgOrderValue">GH₵0.00</div>
                </div>
                <div class="stat-card">
                    <h3>Pending Orders</h3>
                    <div class="stat-value" id="pendingOrders">0</div>
                </div>
            </div>
            
            <div style="background-color: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="color: #000; margin: 0;">📦 Product Management (<span id="productCount">0</span> products)</h3>
                    <button class="button-secondary" id="refreshBtn" onclick="refreshProducts()">
                        <span class="loading-spinner hidden" id="refreshSpinner"></span>
                        <span id="refreshText">Refresh Products</span>
                    </button>
                </div>
                <div style="background-color: #fed7aa; padding: 1rem; border-radius: 0.5rem;">
                    <p style="margin: 0; font-size: 0.9rem; color: #000;">
                        📊 Products are automatically loaded from your Google Sheets. Use the refresh button to sync latest changes.
                    </p>
                </div>
            </div>
            
            <div class="orders-container">
                <div class="orders-header">
                    <h3 style="color: #000; margin: 0;">📋 Order Management (<span id="orderCount">0</span> orders)</h3>
                    <div style="display: flex; gap: 1rem;">
                        <button class="button-secondary" onclick="loadAdminData()">
                            <span class="loading-spinner hidden" id="ordersSpinner"></span>
                            <span id="ordersText">Refresh Orders</span>
                        </button>
                        <button class="button-secondary" onclick="clearAllLocalData()">Clear Local Data</button>
                    </div>
                </div>
                <div id="ordersContainer">
                    {/* Orders will be loaded here */}
                </div>
            </div>
        </div>
    );  
};