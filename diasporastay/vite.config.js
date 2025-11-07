import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving one level up to fix Bootstrap Icons access
      allow: [resolve(__dirname, '.'), resolve(__dirname, '..')],
    },
  },
})

