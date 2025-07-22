# 🛒 GHHomegoods E-commerce

A modular, scalable e-commerce platform built for the GHHomegoods brand, enabling seamless shopping, order tracking, and admin management — optimized for fast delivery and user experience in Ghana and beyond.

---

## 📁 Project Structure

ghhomegoods-ecommerce/
├── index.html # Clean HTML with module imports
├── assets/
│ ├── css/main.css # Responsive styling
│ └── js/ # Modular JavaScript
│ ├── config.js # Configuration & constants
│ ├── api.js # API communication (Google Sheets, PHP proxy)
│ ├── products.js # Product management logic
│ ├── cart.js # Shopping cart logic
│ ├── orders.js # Checkout & order processing
│ ├── admin.js # Admin panel logic
│ ├── navigation.js # Page routing and UI transitions
│ └── main.js # Application bootstrap
├── scripts/ # Automation scripts
├── tests/ # Jest test files
├── .env.example # Environment variable template
├── webpack.config.js # Webpack bundling config
├── package.json # Dependencies & scripts
├── README.md # You're here!
└── api/proxy.php # PHP proxy to bypass CORS

yaml
Copy code

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nanak2/homegoodsreact.git
cd homegoodsreact
2. Install dependencies
bash
Copy code
npm install
3. Set up environment variables
Rename .env.example to .env and update the values:

env
Copy code
ADMIN_PASSWORD=your_secure_admin_password
GOOGLE_APPS_SCRIPT_URL=https://your-google-script-url
🔧 Development Commands
bash
Copy code
npm run dev           # Start dev server with hot reload
npm run build         # Production build (dist/)
npm run deploy        # Custom deploy script
npm test              # Run Jest tests
npm run test:coverage # Run tests with coverage
🧪 Testing with Jest
Unit tests are located in the tests/ folder. Example files:

cart.test.js

products.test.js

orders.test.js

Use this command to run them:

bash
Copy code
npm test
✅ Features
Google Sheets as a live database

Mobile Money-ready checkout

Full cart and admin panel support

PHP proxy for CORS-safe backend calls

Fully responsive layout

Modular JavaScript (easy to maintain/scale)

📦 Deployment Options
You can deploy this app using:

Vercel (recommended for frontend)

Firebase Hosting

GitHub Pages (for static content)

DreamHost + PHP (for backend/proxy)

👥 Contributors
Built and maintained by @Nanak2

