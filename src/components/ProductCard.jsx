import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SIZES } from '../data/constants'
import { money } from '../lib/format'
import { useCart } from '../store/CartContext'

export default function ProductCard({ p }) {
  const { add } = useCart()
  const [ci, setCi] = useState(0)
  const [size, setSize] = useState('')
  const [hint, setHint] = useState(false)
  const color = p.colors[ci] || { images: [], stock: {} }
  const [img1, img2] = color.images
  const avail = (s) => (+color.stock?.[s] || 0) > 0
  const soldOut = !SIZES.some(avail)
  const isNew = Date.now() - p.createdAt < 86400000 * 20

  const addToCart = () => {
    if (!size) { setHint(true); return }
    add(p.id, color.name, size, 1); setSize(''); setHint(false)
  }

  return (
    <article className="group flex flex-col">
      <Link to={`/producto/${p.id}`} className="relative block aspect-[4/5] overflow-hidden bg-white">
        {img1 && <img src={img1} alt={`${p.name} — ${color.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:opacity-0" />}
        {img2 && <img src={img2} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {isNew && <span className="bg-ink px-2 py-1 text-[10px] uppercase tracking-wide2 text-white">Nuevo</span>}
          {soldOut && <span className="bg-white px-2 py-1 text-[10px] uppercase tracking-wide2">Agotado</span>}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link to={`/producto/${p.id}`} className="font-display text-sm font-semibold leading-snug hover:text-sage-deep">{p.name}</Link>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ink-500">{p.category} · Soporte {p.support.toLowerCase()}</p>
        </div>
        <p className="text-sm font-medium">{money(p.price)}</p>
      </div>
      <div className="mt-3 flex gap-1.5" role="radiogroup" aria-label="Color">
        {p.colors.map((c, i) => (
          <button key={c.name} role="radio" aria-checked={i === ci} aria-label={c.name} title={c.name} onClick={() => { setCi(i); setSize('') }}
            className={`h-5 w-5 rounded-full border transition ${i === ci ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone' : 'border-ink/20'}`} style={{ background: c.hex }} />
        ))}
      </div>
      <div className="mt-3 flex gap-1" role="radiogroup" aria-label="Talla">
        {SIZES.map((s) => (
          <button key={s} role="radio" aria-checked={size === s} disabled={!avail(s)} onClick={() => { setSize(s); setHint(false) }}
            className={`h-8 flex-1 border text-[11px] transition disabled:cursor-not-allowed disabled:text-ink/25 disabled:line-through ${size === s ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>{s}</button>
        ))}
      </div>
      <button disabled={soldOut} onClick={addToCart} className="btn-dark mt-3 !py-2.5">{soldOut ? 'Agotado' : 'Añadir al carrito'}</button>
      {hint && <p role="alert" className="mt-1.5 text-xs text-sage-deep">Elige una talla primero.</p>}
    </article>
  )
}
