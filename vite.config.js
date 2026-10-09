import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative paths, so the build works at any address (GitHub Pages puts it
  // under /lfbab/, another host might serve it from the root).
  base: './',
  server: { host: true },
})
