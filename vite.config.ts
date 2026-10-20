import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The lazy-loaded three.js scene chunk is ~900 kB; everything else is small.
  build: { chunkSizeWarningLimit: 1000 },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
