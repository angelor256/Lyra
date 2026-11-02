import { garmentImage } from '../lib/placeholder'

const C = {
  negro: ['Negro', '#161616'], salvia: ['Verde Salvia', '#8A9A86'], euca: ['Eucalipto', '#7B8C7A'],
  hueso: ['Hueso', '#E9E6DC'], grafito: ['Grafito', '#4A4D4B'], arena: ['Arena', '#C9BBA3'],
}
const col = (key, category, stock) => {
  const [name, hex] = C[key]
  return { name, hex, images: [garmentImage(category, hex, 0), garmentImage(category, hex, 1)], stock }
}
const st = (xs, s, m, l, xl) => ({ XS: xs, S: s, M: m, L: l, XL: xl })

const base = [
  ['Aura High-Rise Legging', 'Leggings', ['Pilates', 'Gym', 'Casual'], 'Medio', 68, 142, 'Cintura alta de compresión suave que esculpe sin apretar. Costuras planas y bolsillo oculto.', 'Nylon reciclado 78% · Elastano 22%. Tejido brushed ultra suave, opacidad total.', ['negro', 'salvia', 'grafito']],
  ['Stride Seamless Top', 'Tops', ['Running', 'Gym'], 'Bajo', 38, 98, 'Top sin costuras con paneles de ventilación en espalda para sesiones largas.', 'Poliamida 72% · Elastano 28%. Tecnología sin costuras, secado rápido.', ['hueso', 'negro', 'euca']],
  ['Pulse Sculpt Bra', 'Bras deportivos', ['Gym', 'Running'], 'Alto', 46, 176, 'Sujeción alta con tirantes cruzados y copas moldeadas removibles.', 'Nylon 80% · Elastano 20%. Banda interior de soporte, antibacteriano.', ['negro', 'salvia']],
  ['Flow Soft Bra', 'Bras deportivos', ['Pilates', 'Casual'], 'Bajo', 36, 120, 'Tacto mantequilla y escote redondo para pilates, yoga y día a día.', 'Nylon 74% · Elastano 26%. Tejido Butter-Soft de cuatro direcciones.', ['arena', 'euca', 'negro']],
  ['Velocity 5" Short', 'Shorts', ['Running', 'Gym'], 'Medio', 42, 87, 'Short ligero con malla interior y bolsillo trasero con cierre.', 'Poliéster reciclado 88% · Elastano 12%. Repelente al agua, reflectantes.', ['negro', 'grafito']],
  ['Lumen Cropped Jacket', 'Chaquetas', ['Casual', 'Running'], 'Bajo', 89, 64, 'Chaqueta corta cortavientos, empaquetable, con capucha ajustable.', 'Nylon ripstop 100%. Acabado DWR hidrorrepelente.', ['salvia', 'negro']],
  ['Orbit Set · Top + Legging', 'Conjuntos', ['Pilates', 'Gym'], 'Medio', 105, 133, 'Conjunto coordinado en tejido compresivo: top de tirantes anchos y legging de cintura alta.', 'Nylon 76% · Elastano 24%. Tejido de compresión media, sin transparencias.', ['euca', 'negro', 'hueso']],
  ['Drift Oversize Tee', 'Tops', ['Casual', 'Pilates'], 'Bajo', 34, 71, 'Camiseta oversize de caída fluida para calentar, estirar y salir.', 'Modal 60% · Algodón orgánico 40%. Hilado peinado.', ['hueso', 'salvia', 'negro']],
  ['Ascent Biker Short', 'Shorts', ['Gym', 'Casual', 'Pilates'], 'Medio', 44, 109, 'Biker short de 7" con cintura ancha que no se enrolla.', 'Nylon 80% · Elastano 20%. Compresión media, acabado mate.', ['negro', 'arena', 'salvia']],
  ['Eclipse Zip Hoodie', 'Chaquetas', ['Casual', 'Gym'], 'Bajo', 78, 52, 'Sudadera con cremallera en felpa técnica, interior cepillado.', 'Algodón 60% · Poliéster reciclado 40%. 320 g/m².', ['grafito', 'negro']],
]

const care = 'Lavar a máquina en frío (30°C) del revés con colores similares. No usar suavizante ni lejía. Secar al aire. No planchar sobre estampados.'
const fit = 'Corte ajustado true-to-size. Si estás entre dos tallas, elige la menor para mayor compresión o la mayor para mayor comodidad. Modelo mide 1,72 m y lleva talla S.'

export const seedProducts = () =>
  base.map(([name, category, discipline, support, price, sold, description, fabric, colors], i) => ({
    id: 'seed-' + (i + 1), name, category, discipline, support, price, sold, description, fabric, fit, care,
    active: true, createdAt: Date.now() - i * 86400000 * 6,
    colors: colors.map((k, j) => col(k, category, st(j === 2 ? 0 : 4, 8, 10, 7, j === 1 ? 0 : 3))),
  }))
