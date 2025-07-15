import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/investment-banking-interview-app/',
  build: {
    outDir: 'dist'
  }
})
