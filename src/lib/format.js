// Colones costarricenses: ₡36 000 (espacio fino como separador de miles)
export const money = (n) => '₡' + Math.round(Number(n || 0)).toLocaleString('en-US').replace(/,/g, '\u202f')
export const totalStock = (p) => (p.colors || []).reduce((a, c) => a + Object.values(c.stock || {}).reduce((x, y) => x + (+y || 0), 0), 0)
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now())
