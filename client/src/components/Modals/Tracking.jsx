// Tracking.js
import React from 'react';

export default function Tracking() {
    return (
        <div id="trackingModal" class="tracking-modal" style="display: none;">
            <div class="tracking-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2>📦 Track Your Order</h2>
                    <button class="close-cart" onclick="closeTracking()">&times;</button>
                </div>
                
                <form id="trackingForm" onsubmit="event.preventDefault(); trackOrder();">
                    <div class="tracking-form">
                        <div class="form-group">
                            <label class="form-label" for="trackingId">Order ID</label>
                            <input type="text" class="form-input" id="trackingId" name="trackingId" placeholder="Enter your order ID (e.g., GH1001)" required />
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="trackingPhone">Phone Number</label>
                            <input type="tel" class="form-input" id="trackingPhone" name="trackingPhone" placeholder="Enter your phone number" required />
                        </div>
                        <button type="submit" class="button" style="width: 100%;">
                            Track Order
                        </button>
                    </div>
                </form>
                
                <div id="trackingResult" class="tracking-result hidden">
                    <div id="orderDetails">
                        {/* Tracking results will appear here */}
                    </div>
                </div>
            </div>
        </div>
    );
}