async function callViaProxy(action, data = {}) {
            try {
                console.log(`📡 Proxy API Call: ${action}`, data);
                
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: action,
                        ...data
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const result = await response.json();
                console.log(`📡 Proxy Response: ${action}`, result);
                
                if (!result.success) {
                    throw new Error(result.message || 'API call failed');
                }
                
                updateConnectionStatus('online');
                return result;
                
            } catch (error) {
                console.error(`💥 Proxy API Error (${action}):`, error);
                updateConnectionStatus('offline');
                throw error;
            }
        async function testConnection() {
            try {
                showLoading('Testing connection via proxy...');
                updateConnectionStatus('testing');
                
                const result = await callViaProxy('verify_system');
                
                hideLoading();
                updateConnectionStatus('online');
                showNotification('✅ Proxy connection successful! System is operational.', 'success');
                return true;
                
            } catch (error) {
                hideLoading();
                updateConnectionStatus('offline');
                showNotification(`❌ Connection test failed: ${error.message}`, 'error');
                return false;
            }
        }
        async function testProxyHealth() {
            try {
                updateConnectionStatus('testing');
                
                // Try the health endpoint first
                try {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const health = await response.json();
                        console.log('🏥 Proxy Health Check:', health);
                        
                        if (health.status === 'healthy') {
                            updateConnectionStatus('online');
                            proxyStatus = 'healthy';
                            showNotification('✅ Proxy is healthy and connected to Google Apps Script', 'success');
                            return health;
                        }
                    }
                } catch (healthError) {
                    console.warn('⚠️ Health endpoint failed, testing main proxy...', healthError);
                }
                
                // Fallback: Test main proxy functionality
                const result = await callViaProxy('verify_system');
                
                updateConnectionStatus('online');
                proxyStatus = 'healthy';
                showNotification('✅ Proxy is working! (Health endpoint may be disabled)', 'success');
                return { status: 'healthy', fallback: true };
                
            } catch (error) {
                console.error('💥 Proxy health check failed:', error);
                updateConnectionStatus('offline');
                proxyStatus = 'error';
                showNotification(`❌ Proxy connection failed: ${error.message}`, 'error');
                return null;
            }
        function updateConnectionStatus(status) {
            connectionStatus = status;
            const statusEl = document.getElementById('connectionStatus');
            
            if (!statusEl) return;
            
            statusEl.className = `connection-status ${status}`;
            
            switch (status) {
                case 'online':
                    statusEl.textContent = '🟢 Connected via Proxy';
                    statusEl.style.display = 'block';
                    setTimeout(() => statusEl.style.display = 'none', 3000);
                    break;
                case 'offline':
                    statusEl.textContent = '🔴 Connection Failed';
                    statusEl.style.display = 'block';
                    break;
                case 'testing':
                    statusEl.textContent = '🟡 Testing Connection...';
                    statusEl.style.display = 'block';
                    break;
                default:
                    statusEl.style.display = 'none';
            }
        }