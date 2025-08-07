// Footer.js
import React from 'react';

export default function Footer () {
    return (
        <footer class="footer">
            <div style="max-width: 1200px; margin: 0 auto;">
                <h3>Ghhomegoods</h3>
                <p style="color: #9ca3af; margin-bottom: 2rem;">
                    Your trusted source for quality household essentials, baby care & personal care products
                </p>
                <div style="margin-bottom: 2rem;">
                    <p style="color: #9ca3af;">
                        📞 +233 59 961 3762 | 📧 ghhomegoods@gmail.com
                    </p>
                    <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 0.5rem;">
                        🚚 Free delivery in Greater Accra for orders over GH₵2000
                    </p>
                </div>
                <div class="payment-info">
                    <p>💰 We accept MTN Mobile Money, Vodafone Cash & AirtelTigo Money</p>
                </div>
                <p style="color: #9ca3af; font-size: 0.875rem;">
                    © 2025 Ghhomegoods. All rights reserved. | Business Registration: Coming Soon
                </p>
                <button class="admin-access" id="adminAccessBtn" onclick="showAdminModal()">Admin Access</button>
            </div>
        </footer>       
    );
};