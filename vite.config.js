import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/https://api.alex-medlearn.com/', 
  build: {
    outDir: 'dist', // Default output directory
  },
})