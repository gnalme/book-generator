import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:5140',
        changeOrigin: true,
        secure: false, // 💥 Это разрешает self-signed сертификаты
      },
    },
  },
})
