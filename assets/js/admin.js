async function loadAdminData() {
            if (!isAdmin) return;
            
            try {
                await Promise.all([
                    loadAdminStats(),
                    loadOrdersForAdmin()
                ]);
            } catch (error) {
                console.error('💥 Admin data loading error:', error);
                showNotification('Failed to load admin data', 'error');
            }
        }
        function adminLogin() {
            const password = document.getElementById('adminPassword').value;
                setAdminMode(true);
                sessionStorage.setItem('gh_admin_session', 'authenticated');
                closeAdminModal();
                showAdmin();
                showNotification('Admin login successful', 'success');
            } else {
                showNotification('Invalid admin password', 'error');
                document.getElementById('adminPassword').value = '';
            }
        function adminLogout() {
            setAdminMode(false);
            sessionStorage.removeItem('gh_admin_session');
            showHome();
            showNotification('Admin logged out', 'info');
        }
        function setAdminMode(admin) {
            isAdmin = admin;
            const adminBtn = document.getElementById('adminBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const adminNotice = document.getElementById('adminNotice');
            const adminAccessBtn = document.getElementById('adminAccessBtn');
            
            if (admin) {
                adminBtn.classList.remove('hidden');
                logoutBtn.classList.remove('hidden');
                adminNotice.style.display = 'block';
                adminAccessBtn.classList.add('hidden');
                
                loadAdminData();
            } else {
                adminBtn.classList.add('hidden');
                logoutBtn.classList.add('hidden');
                adminNotice.style.display = 'none';
                adminAccessBtn.classList.remove('hidden');
            }
        }