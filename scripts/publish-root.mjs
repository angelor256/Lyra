// Copia el build a la raíz del repo para que GitHub Pages funcione también si la fuente
// está en "Deploy from a branch (main /root)". Uso: npm run publish:root
import { cpSync, rmSync } from 'node:fs'
rmSync('assets', { recursive: true, force: true })
for (const f of ['index.html', '404.html', 'favicon.svg', 'assets']) cpSync(`dist/${f}`, f, { recursive: true })
console.log('Build publicado en la raíz del repo.')
