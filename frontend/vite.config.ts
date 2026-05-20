import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // expose on all network interfaces
    port: 5173,
    // Proxy API calls to Laravel backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8021',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
