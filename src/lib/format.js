export const money = (n) => '$' + Number(n || 0).toLocaleString('es-ES', { minimumFractionDigits: Number.isInteger(+n) ? 0 : 2, maximumFractionDigits: 2 })
export const totalStock = (p) => (p.colors || []).reduce((a, c) => a + Object.values(c.stock || {}).reduce((x, y) => x + (+y || 0), 0), 0)
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now())
