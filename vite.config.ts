import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy ISS API calls to bypass CORS in development
      '/api/iss': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/iss/, ''),
      },
      // Proxy Guardian API
      '/api/guardian': {
        target: 'https://content.guardianapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/guardian/, ''),
      },
    },
  },
})
