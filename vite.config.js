import { defineConfig } from 'vite'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    outDir: 'dist/web',
    rollupOptions: {
      input: {
        parent: resolve(__dirname, 'parent.html'),
        iframe: resolve(__dirname, 'iframe.html'),
        e2e_iframe: resolve(__dirname, 'e2e_iframe.html'),
      },
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    hmr: {
      port: 443, // Run the websocket server on the SSL port
    },
    // Proxy API calls to the demo backend on port 3000
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
