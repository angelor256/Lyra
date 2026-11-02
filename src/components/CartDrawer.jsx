import { useEffect } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from 'lucide-react'
import { useCart } from '../store/CartContext'
import { useShop } from '../store/ShopContext'
import { money } from '../lib/format'
import { buildOrderMessage, whatsappUrl } from '../lib/whatsapp'
import Sparkle from './Sparkle'

export default function CartDrawer() {
  const { open, setOpen, items, total, setQty, remove, customer, setCustomer, clear } = useCart()
  const { settings } = useShop()
  const { freeShippingFrom, whatsapp } = settings.store
  const ready = items.length > 0 && customer.name.trim() && customer.address.trim()
  const over = items.some((i) => i.qty > i.stock)

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    if (open) { document.addEventListener('keydown', k); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open, setOpen])

  if (!open) return null
  const missing = Math.max(0, freeShippingFrom - total)

  const checkout = () => {
    const msg = buildOrderMessage(items, total, customer)
    window.open(whatsappUrl(whatsapp, msg), '_blank', 'noopener')
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito">
      <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slideIn flex-col bg-bone shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide2"><ShoppingBag className="h-4 w-4" /> Tu carrito</h2>
          <button aria-label="Cerrar" onClick={() => setOpen(false)}><X /></button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div><Sparkle className="mx-auto h-6 w-6 text-sage-deep" /><p className="mt-4 font-display text-lg">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-ink-500">Muévete con propósito. Descubre la colección.</p></div>
          </div>
        ) : (
          <>
            <div className="border-b border-ink/10 px-5 py-3 text-xs">
              {missing > 0 ? <>Te faltan <b>{money(missing)}</b> para envío gratis</> : <span className="text-sage-deep">✦ ¡Envío gratis conseguido!</span>}
              <div className="mt-2 h-1 bg-ink/10"><div className="h-full bg-sage-deep transition-all" style={{ width: `${Math.min(100, (total / freeShippingFrom) * 100)}%` }} /></div>
            </div>
            <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 py-4">
                  <img src={i.image} alt="" className="h-24 w-20 bg-white object-cover" />
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between gap-2"><p className="font-display font-semibold">{i.name}</p><p>{money(i.price * i.qty)}</p></div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500"><span className="h-3 w-3 rounded-full border border-ink/20" style={{ background: i.hex }} />{i.color} · Talla {i.size}</p>
                    {i.qty > i.stock && <p className="mt-1 text-xs text-red-700">Solo quedan {i.stock} disponibles</p>}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-ink/20">
                        <button aria-label="Menos" className="p-1.5" onClick={() => setQty(i.key, i.qty - 1)}><Minus className="h-3 w-3" /></button>
                        <span className="w-7 text-center text-xs">{i.qty}</span>
                        <button aria-label="Más" className="p-1.5" onClick={() => setQty(i.key, i.qty + 1)}><Plus className="h-3 w-3" /></button>
                      </div>
                      <button aria-label="Eliminar" className="text-ink-500 hover:text-ink" onClick={() => remove(i.key)}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-ink/10 bg-white p-5">
              <div>
                <label className="label" htmlFor="cn">Nombre del cliente</label>
                <input id="cn" className="input" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} autoComplete="name" />
              </div>
              <div>
                <label className="label" htmlFor="ca">Dirección de envío</label>
                <input id="ca" className="input" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} autoComplete="street-address" />
              </div>
              <div className="flex items-baseline justify-between pt-1"><span className="text-xs uppercase tracking-wide2">Total</span><span className="font-display text-xl font-bold">{money(total)}</span></div>
              <button className="btn w-full !py-3.5 bg-[#25D366] text-ink hover:brightness-95" disabled={!ready || over} onClick={checkout}>
                <MessageCircle className="h-4 w-4" /> Finalizar pedido por WhatsApp
              </button>
              {!ready && <p className="text-center text-[11px] text-ink-500">Completa nombre y dirección para enviar el pedido.</p>}
              <button className="w-full text-center text-[11px] uppercase tracking-wide2 text-ink-500 underline" onClick={clear}>Vaciar carrito</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
