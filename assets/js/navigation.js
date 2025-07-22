function showTracking() {
            document.getElementById('trackingModal').style.display = 'flex';
        }
        function closeTracking() {
            document.getElementById('trackingModal').style.display = 'none';
            document.getElementById('trackingResult').classList.add('hidden');
        }
        function showHome() {
            setActiveView('home');
            document.getElementById('homePage').classList.remove('hidden');
            document.getElementById('shopPage').classList.add('hidden');
            document.getElementById('adminPage').classList.add('hidden');
        }
        function showShop(category = null) {
            setActiveView('shop');
            document.getElementById('homePage').classList.add('hidden');
            document.getElementById('shopPage').classList.remove('hidden');
            document.getElementById('adminPage').classList.add('hidden');
            
            initializeSearch();
            
            if (category) {
                currentFilter = category;
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.textContent.toLowerCase().includes(category.replace('-', ' '))) {
                        btn.classList.add('active');
                    }
                });
                updateProductDisplay();
            }
        }
        function showAdmin() {
            if (!isAdmin) {
                showAdminModal();
                return;
            }
            setActiveView('admin');
            document.getElementById('homePage').classList.add('hidden');
            document.getElementById('shopPage').classList.add('hidden');
            document.getElementById('adminPage').classList.remove('hidden');
            
            loadAdminData();
        }
        function showAdminModal() {
            document.getElementById('modalBackdrop').style.display = 'block';
            document.getElementById('adminModal').style.display = 'block';
            document.getElementById('adminPassword').focus();
        }
        function closeAdminModal() {
            document.getElementById('modalBackdrop').style.display = 'none';
            document.getElementById('adminModal').style.display = 'none';
            document.getElementById('adminPassword').value = '';
        }
        function showCart() {
            const cartModal = document.getElementById('cartModal');
            cartModal.classList.add('open');
            updateCartContent();
        }
        function closeCart() {
            const cartModal = document.getElementById('cartModal');
            cartModal.classList.remove('open');
        }
        function closeCheckout() {
            const checkoutModal = document.getElementById('checkoutModal');
            checkoutModal.style.display = 'none';
        }
        function clearAllData() {
            if (confirm('This will clear all cart items and local order history. Are you sure?')) {
                cart = [];
                orders = [];
                orderCounter = 1000;
                updateCartUI();
                updateOrderDisplay();
                updateAdminStatsDisplay();
                showNotification('All local data cleared successfully', 'info');
            }
        }
        function clearAllLocalData() {
            clearAllData();
        }