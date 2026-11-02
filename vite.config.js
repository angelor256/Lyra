import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, renameSync } from 'node:fs'

// En GitHub Pages el sitio vive en /<repo>/. Se define con VITE_BASE (el workflow lo fija).
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  server: { open: '/app.html' },
  build: { rollupOptions: { input: 'app.html' } },
  plugins: [
    react(),
    {
      name: 'pages-output',
      closeBundle() {
        // app.html -> index.html, y 404.html como fallback SPA
        try { renameSync('dist/app.html', 'dist/index.html'); copyFileSync('dist/index.html', 'dist/404.html') } catch {}
      },
    },
  ],
})
