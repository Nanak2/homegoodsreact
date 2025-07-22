async function loadProductsFromGoogleSheets() {
            setLoadingState(true);
            
            try {
                // Try to load from Google Sheets CSV first (for product data)
                const corsProxies = [
                    'https://api.allorigins.win/raw?url=',
                    'https://corsproxy.io/?',
                    ''
                ];
                
                let loaded = false;
                
                for (let i = 0; i < corsProxies.length && !loaded; i++) {
                    try {
                        const proxy = corsProxies[i];
                        const url = proxy + encodeURIComponent(baseUrl);
                        
                        console.log(`📊 Attempting to load products via ${proxy ? 'proxy' : 'direct'}...`);
                        
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: { 'Accept': 'text/csv,text/plain,*/*' }
                        });
                        
                        if (response.ok) {
                            const csvText = await response.text();
                            const parsedProducts = parseCSVProducts(csvText);
                            
                            if (parsedProducts.length > 0) {
                                products = parsedProducts;
                                console.log(`✅ Loaded ${parsedProducts.length} products from Google Sheets`);
                                showNotification(`Loaded ${parsedProducts.length} products from Google Sheets`, 'success');
                                loaded = true;
                            }
                        }
                    } catch (error) {
                        console.log(`❌ Proxy ${i + 1} failed:`, error.message);
                    }
                }
                
                if (!loaded) {
                    console.log('📦 Using fallback products');
                    showNotification('Using offline catalog. Some products may not be current.', 'warning');
                }
                
            } catch (error) {
                console.error('💥 Product loading error:', error);
                showNotification('Failed to load products. Using offline catalog.', 'warning');
            }
            
            setLoadingState(false);
            loadProducts();
            updateProductCount();
        }
        function parseCSVProducts(csvText) {
            try {
                const lines = csvText.split('\n').filter(line => line.trim());
                if (lines.length < 2) return [];
                
                const products = [];
                
                // Log the header to understand the structure
                console.log('📊 CSV Header:', lines[0]);
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = parseCSVLine(line);
                    
                    if (values.length < 6) continue;
                    
                    try {
                        const rawImageUrl = values[6]?.trim() || '';
                        const processedImageUrl = fixGoogleDriveUrl(rawImageUrl);
                        
                        const product = {
                            id: parseInt(values[0]) || i,
                            name: values[1]?.trim() || `Product ${i}`,
                            price: parseFloat(values[2]) || 0,
                            category: values[3]?.trim().toLowerCase().replace(/\s+/g, '-') || 'general',
                            description: values[5]?.trim() || values[1]?.trim() || `Quality ${values[1]?.toLowerCase()} product`,
                            imageUrl: processedImageUrl,
                            inStock: true,
                            featured: i <= 8
                        };
                        
                        // Add original price if available (column 7)
                        if (values[7] && parseFloat(values[7]) > 0) {
                            product.originalPrice = parseFloat(values[7]);
                        }
                        
                        if (product.name && product.name.length > 1 && product.price > 0) {
                            products.push(product);
                            console.log(`📦 Product ${i}: ${product.name} - Image: ${processedImageUrl ? '✅' : '❌'}`);
                        }
                        
                    } catch (parseError) {
                        console.warn(`⚠️ Error parsing product row ${i}:`, parseError, 'Values:', values);
                    }
                }
                
                console.log(`✅ Parsed ${products.length} products from CSV`);
                return products;
                
            } catch (error) {
                console.error('💥 CSV parsing error:', error);
                return [];
            }
        }
        function parseCSVLine(line) {
            const values = [];
            let current = '';
            let inQuotes = false;
            let i = 0;
            
            while (i < line.length) {
                const char = line[i];
                
                if (char === '"') {
                    if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                        current += '"';
                        i += 2;
                        continue;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
                i++;
            }
            
            values.push(current.trim().replace(/^"|"$/g, ''));
            return values;
        }
        function fixGoogleDriveUrl(url) {
            if (!url || typeof url !== 'string') {
                return '';
            }
            
            // Handle direct image URLs (already working)
            if (url.includes('drive.google.com/uc?id=')) {
                return url;
            }
            
            // Handle sharing URLs like: https://drive.google.com/file/d/FILE_ID/view
            let fileId = null;
            
            // Try different URL patterns
            const patterns = [
                /\/file\/d\/([a-zA-Z0-9-_]+)/,           // /file/d/ID/
                /[?&]id=([a-zA-Z0-9-_]+)/,               // ?id=ID or &id=ID
                /\/d\/([a-zA-Z0-9-_]+)/,                 // /d/ID
                /drive\.google\.com\/.*\/([a-zA-Z0-9-_]+)/ // fallback pattern
            ];
            
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    fileId = match[1];
                    break;
                }
            }
            
            if (fileId) {
                // Convert to direct image URL
                return `https://drive.google.com/uc?export=view&id=${fileId}`;
            }
            
            // If it's already a working URL, return as-is
            if (url.startsWith('http')) {
                return url;
            }
            
            console.warn('Could not parse Google Drive URL:', url);
            return '';
        }
        function loadProducts() {
            const featuredContainer = document.getElementById('featuredProducts');
            const allContainer = document.getElementById('allProducts');
            
            if (featuredContainer) {
                featuredContainer.innerHTML = '';
                products.filter(p => p.featured).forEach(product => {
                    featuredContainer.innerHTML += createProductHTML(product);
                });
            }
            
            if (allContainer) {
                updateProductDisplay();
            }
        }
        function updateProductDisplay() {
            const allContainer = document.getElementById('allProducts');
            if (!allContainer) return;
            
            let displayProducts = [...products];
            
            if (currentFilter !== 'all') {
                displayProducts = displayProducts.filter(product => 
                    product.category.includes(currentFilter) || 
                    product.category.includes(currentFilter.replace('-', ''))
                );
            }
            
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                displayProducts = displayProducts.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
            }
            
            allContainer.innerHTML = '';
            if (displayProducts.length === 0) {
                allContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6b7280;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search terms or filters</p>
                    </div>
                `;
            } else {
                displayProducts.forEach(product => {
                    allContainer.innerHTML += createProductHTML(product);
                });
            }
            
            updateSearchResults(displayProducts.length);
        }
        function createProductHTML(product) {
            const safeName = product.name.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
            const safeDescription = (product.description || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
            
            // Enhanced image handling
            let imageHTML;
            if (product.imageUrl && product.imageUrl.trim()) {
                const processedUrl = fixGoogleDriveUrl(product.imageUrl.trim());
                console.log('🖼️ Image for', product.name, ':', processedUrl);
                
                imageHTML = `
                    <img src="${processedUrl}" 
                         alt="${safeName}" 
                         style="width: 100%; height: 100%; object-fit: cover;" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; console.log('❌ Failed to load image:', this.src);"
                         onload="console.log('✅ Image loaded:', this.src);">
                    <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; color: #9ca3af; flex-direction: column; text-align: center;">
                        <span style="font-size: 2rem; margin-bottom: 0.5rem;">📷</span>
                        <span style="font-size: 0.875rem;">Image Not Available</span>
                    </div>
                `;
            } else {
                imageHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #9ca3af; flex-direction: column;">
                        <span style="font-size: 3rem; margin-bottom: 0.5rem;">📦</span>
                        <span style="font-size: 0.875rem;">No Image</span>
                    </div>
                `;
            }

            const displayDescription = product.description && product.description.trim() && product.description !== product.name 
                ? product.description 
                : `Premium ${product.name.toLowerCase()} - Quality guaranteed`;

            return `
                <div class="product-card">
                    <div class="product-image">
                        ${product.originalPrice ? '<div class="sale-badge">SALE</div>' : ''}
                        ${imageHTML}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description" title="${safeDescription}">${displayDescription}</p>
                        <div class="price-container">
                            <span class="current-price">GH₵ ${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">GH₵ ${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="button" onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            `;
        }
        function updateSearchResults(count) {
            const searchResults = document.getElementById('searchResults');
            if (!searchResults) return;
            
            let message = '';
            if (searchQuery.trim() || currentFilter !== 'all') {
                message = `Showing ${count} product${count !== 1 ? 's' : ''}`;
                if (searchQuery.trim()) {
                    message += ` for "${searchQuery}"`;
                }
                if (currentFilter !== 'all') {
                    message += ` in ${currentFilter.replace('-', ' ')}`;
                }
            }
            searchResults.textContent = message;
        }