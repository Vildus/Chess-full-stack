import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
        '^/api': {
            target: 'http://localhost:3000'
        },
        '/socket.io': {
          target: 'ws://localhost:3000',
          ws: true,
        },
    },
    port: 8080
  }
})