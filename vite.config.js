import { defineConfig } from 'vite'
const { resolve } = require('path')

export default defineConfig({
  plugins: [],
  build: {
    outDir: 'dist/web',
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'demo.html'),
        backend_demo: resolve(__dirname, 'backend_demo.html'),
        demo_plugin: resolve(__dirname, 'demo_plugin.html'),
        backend_demo_plugin: resolve(__dirname, 'backend_demo_plugin.html'),
      },
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    // Proxy API calls to the demo express backend on port 3000
    // This needs to have been started with `npm run backend:watch`
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
