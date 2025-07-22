const PROXY_URL = 'https://ghhomegoods.com/api/proxy.php';
        const PROXY_HEALTH_URL = 'https://ghhomegoods.com/api/proxy.php?health=1';
        const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/14yjMXMc3AliGRemAPHU0GKPEBhW9h6Dzu6zv3kPC_fg/export?format=csv&gid=0';
        const ADMIN_PASSWORD = 'GHAdmin2025!';
        const PAYMENT_INFO = {
        const fallbackProducts = [
            console.log('📡 Proxy URL:', PROXY_URL);
                const response = await fetch(PROXY_URL, {
                    const response = await fetch(PROXY_HEALTH_URL, {
                const baseUrl = GOOGLE_SHEETS_CSV_URL;
                    products = [...fallbackProducts];
                products = [...fallbackProducts];
                        Send to: ${PAYMENT_INFO.mtn.number}<br>
                        Name: ${PAYMENT_INFO.mtn.name}
                        Send to: ${PAYMENT_INFO.vodafone.number}<br>
                        Name: ${PAYMENT_INFO.vodafone.name}
                        Send to: ${PAYMENT_INFO.airteltigo.number}<br>
                        Name: ${PAYMENT_INFO.airteltigo.name}
            if (password === ADMIN_PASSWORD) {