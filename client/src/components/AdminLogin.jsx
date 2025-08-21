// AdminLogin.js
import React from 'react';

export default function AdminLogin() {
    return (
        <div id="modalBackdrop" class="modal-backdrop" style="display: none;">
            <div id="adminModal" class="modal" style="display: none;">
                <h2>🔐 Admin Login</h2>
                <input type="password" id="adminPassword" placeholder="Enter admin password" autocomplete="current-password" />
                <div class="modal-buttons">
                    <button class="button-secondary" onclick="closeAdminModal()">Cancel</button>
                    <button class="button" onclick="adminLogin()">Login</button>
                </div>
                <p style="font-size: 0.8rem; color: #6b7280; text-align: center; margin-top: 1rem; margin-bottom: 0;">
                    Tip: Press Ctrl+Shift+A to open this login
                </p>
            </div>
        </div>
    );
};