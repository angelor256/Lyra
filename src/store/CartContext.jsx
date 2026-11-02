import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useShop } from './ShopContext'

const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)
const KEY = 'lyra.cart.v1'
const keyOf = (l) => `${l.productId}|${l.color}|${l.size}`

export function CartProvider({ children }) {
  const { products } = useShop()
  const [lines, setLines] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } })
  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY + '.c')) || { name: '', address: '' } } catch { return { name: '', address: '' } } })

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch {} }, [lines])
  useEffect(() => { try { localStorage.setItem(KEY + '.c', JSON.stringify(customer)) } catch {} }, [customer])

  // Líneas enriquecidas con datos vivos del producto (precio, stock, imagen)
  const items = useMemo(() => lines.map((l) => {
    const p = products.find((x) => x.id === l.productId)
    if (!p) return null
    const c = p.colors.find((x) => x.name === l.color)
    const stock = c ? +c.stock?.[l.size] || 0 : 0
    return { ...l, key: keyOf(l), name: p.name, price: p.price, image: c?.images?.[0], hex: c?.hex, stock, product: p }
  }).filter(Boolean), [lines, products])

  const count = items.reduce((a, i) => a + i.qty, 0)
  const total = items.reduce((a, i) => a + i.qty * i.price, 0)

  const add = (productId, color, size, qty = 1) => {
    setLines((ls) => {
      const l = { productId, color, size, qty }
      const ex = ls.find((x) => keyOf(x) === keyOf(l))
      return ex ? ls.map((x) => (x === ex ? { ...x, qty: x.qty + qty } : x)) : [...ls, l]
    })
    setOpen(true)
  }
  const setQty = (key, qty) => setLines((ls) => ls.flatMap((x) => (keyOf(x) !== key ? [x] : qty <= 0 ? [] : [{ ...x, qty }])))
  const remove = (key) => setQty(key, 0)
  const clear = () => setLines([])

  return <Ctx.Provider value={{ items, count, total, add, setQty, remove, clear, open, setOpen, customer, setCustomer }}>{children}</Ctx.Provider>
}
