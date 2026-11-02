// Imágenes de producto generadas (SVG) en la paleta LYRA. Sustituibles por fotos reales desde /admin.
const shapes = {
  Leggings: 'M70 40h100l8 40-18 150h-30l-10-90-10 90H82L62 80z',
  Tops: 'M85 50l35 14 35-14 32 28-22 24-12-8v108H87V94l-12 8-22-24z',
  'Bras deportivos': 'M80 80c14 8 26 12 40 12s26-4 40-12l12 36c-6 22-28 32-52 32s-46-10-52-32z M96 60l-6 24M144 60l6 24',
  Shorts: 'M74 80h92l14 100h-52l-8-44-8 44H60z',
  Chaquetas: 'M82 54l38 12 38-12 34 36-18 120h-30V120h-48v90H66L48 90z M120 66v144',
  Conjuntos: 'M88 52l32 10 32-10 20 26-16 18v28H84V96L68 78z M84 138h72l8 80h-30l-14-44-14 44H76z',
}
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, v + amt))
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')
}
export function garmentImage(category, hex = '#1a1a1a', variant = 0) {
  const light = (parseInt(hex.slice(1), 16) >> 16) > 150
  const bg = variant ? '#1A1A1A' : '#ECEBE6'
  const bg2 = variant ? '#0f0f0f' : '#D9DBD4'
  const fill = hex
  const stroke = shade(hex, light ? -40 : 40)
  const d = shapes[category] || shapes.Tops
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>
<linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(fill, 22)}"/><stop offset="1" stop-color="${shade(fill, -18)}"/></linearGradient></defs>
<rect width="240" height="300" fill="url(#g)"/>
<g transform="${variant ? 'translate(240 0) scale(-1 1) translate(0 8)' : 'translate(0 8)'}"><path d="${d}" fill="url(#f)" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round" stroke-opacity=".5"/></g>
<path d="M120 258c1 7 3 10 12 12-9 2-11 5-12 12-1-7-3-10-12-12 9-2 11-5 12-12z" fill="${variant ? '#8A9A86' : '#121212'}" opacity=".7"/></svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
