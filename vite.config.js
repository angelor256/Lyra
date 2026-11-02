import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'

// En GitHub Pages el sitio vive en /<repo>/. Se define con VITE_BASE (el workflow lo fija).
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    // Fallback SPA para Pages: 404.html = index.html
    { name: 'spa-404', closeBundle() { try { copyFileSync('dist/index.html', 'dist/404.html') } catch {} } },
  ],
})
