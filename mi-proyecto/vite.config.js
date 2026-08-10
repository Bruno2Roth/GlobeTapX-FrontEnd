import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://A-PHZ2-CIDI-16:3001",
        changeOrigin: true,
      },
    },
  },
})
