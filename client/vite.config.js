import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In development, proxy /api requests to the Express server
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
