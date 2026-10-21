import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // the Python back end (backend/main.py) serves /api
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
})
