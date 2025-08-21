// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth/login': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/api/auth/signup': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/api/products/': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/api/order/': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
    }
  }
})