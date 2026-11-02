export const SIZES = ['XS', 'S', 'M', 'L', 'XL']
export const CATEGORIES = ['Leggings', 'Tops', 'Bras deportivos', 'Shorts', 'Chaquetas', 'Conjuntos']
export const DISCIPLINES = ['Pilates', 'Gym', 'Running', 'Casual']
export const SUPPORT_LEVELS = ['Bajo', 'Medio', 'Alto']
export const COLOR_PRESETS = [
  { name: 'Negro', hex: '#161616' },
  { name: 'Verde Salvia', hex: '#8A9A86' },
  { name: 'Eucalipto', hex: '#7B8C7A' },
  { name: 'Hueso', hex: '#E9E6DC' },
  { name: 'Grafito', hex: '#4A4D4B' },
  { name: 'Arena', hex: '#C9BBA3' },
]
export const SORTS = [
  { id: 'new', label: 'Novedades' },
  { id: 'best', label: 'Más vendidos' },
  { id: 'price-asc', label: 'Precio: menor a mayor' },
  { id: 'price-desc', label: 'Precio: mayor a menor' },
]
export const DEFAULT_SETTINGS = {
  banner: { enabled: true, text: 'Envío gratis por compras mayores a $80 ✦', link: '/tienda', tone: 'sage' },
  store: { whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '34600000000', freeShippingFrom: 80 },
}
