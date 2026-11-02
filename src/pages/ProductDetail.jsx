import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Ruler, Shirt, Droplets } from 'lucide-react'
import { useShop } from '../store/ShopContext'
import { useCart } from '../store/CartContext'
import ProductCard from '../components/ProductCard'
import Sparkle from '../components/Sparkle'
import { SIZES } from '../data/constants'
import { money } from '../lib/format'

const TABS = [['fabric', 'Tecnología de la Tela', Shirt], ['fit', 'Guía de Ajuste', Ruler], ['care', 'Cuidado de la Prenda', Droplets]]
const SIZE_CHART = [['XS', '32–34', '58–62', '84–88'], ['S', '36', '63–67', '89–93'], ['M', '38', '68–72', '94–98'], ['L', '40', '73–77', '99–103'], ['XL', '42', '78–83', '104–108']]

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading } = useShop()
  const { add } = useCart()
  const [ci, setCi] = useState(0)
  const [ii, setIi] = useState(0)
  const [size, setSize] = useState('')
  const [tab, setTab] = useState('fabric')
  const [hint, setHint] = useState(false)
  const p = products.find((x) => x.id === id)

  if (loading) return <p className="container-x py-24">Cargando…</p>
  if (!p) return <div className="container-x py-24 text-center"><p className="font-display text-2xl">Prenda no encontrada</p><Link to="/tienda" className="btn-dark mt-6">Volver a la tienda</Link></div>

  const color = p.colors[ci] || { images: [], stock: {}, name: '' }
  const stock = (s) => +color.stock?.[s] || 0
  const related = products.filter((x) => x.id !== p.id && (x.category === p.category || x.discipline.some((d) => p.discipline.includes(d)))).slice(0, 4)

  const onAdd = () => { if (!size) return setHint(true); add(p.id, color.name, size, 1); setHint(false) }

  return (
    <div className="container-x py-8">
      <nav className="flex items-center gap-1 text-xs text-ink-500" aria-label="Migas de pan">
        <Link to="/tienda" className="hover:text-ink">Tienda</Link><ChevronRight className="h-3 w-3" />
        <Link to={`/tienda?cat=${encodeURIComponent(p.category)}`} className="hover:text-ink">{p.category}</Link><ChevronRight className="h-3 w-3" /><span className="text-ink">{p.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-2 sm:flex-col">
            {color.images.filter(Boolean).map((src, i) => (
              <button key={i} onClick={() => setIi(i)} aria-label={`Imagen ${i + 1}`} className={`h-20 w-16 overflow-hidden border ${ii === i ? 'border-ink' : 'border-transparent opacity-70'}`}><img src={src} alt="" className="h-full w-full object-cover" /></button>
            ))}
          </div>
          <div className="aspect-[4/5] flex-1 overflow-hidden bg-white"><img src={color.images[ii] || color.images[0]} alt={`${p.name} en ${color.name}`} className="h-full w-full object-cover" /></div>
        </div>

        <div>
          <p className="eyebrow">{p.category} · {p.discipline.join(' / ')}</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight">{p.name}</h1>
          <p className="mt-3 flex items-baseline gap-3 text-2xl">{money(p.price)}{p.comparePrice > p.price && <s className="text-base text-ink-500">{money(p.comparePrice)}</s>}</p>
          <p className="mt-5 leading-relaxed text-ink-500">{p.description}</p>
          <p className="mt-4 text-xs uppercase tracking-wide2">Soporte: <b>{p.support}</b></p>

          <p className="label mt-8">Color: <span className="text-ink">{color.name}</span></p>
          <div className="flex gap-2" role="radiogroup" aria-label="Color">
            {p.colors.map((c, i) => <button key={c.name} role="radio" aria-checked={i === ci} aria-label={c.name} title={c.name} onClick={() => { setCi(i); setIi(0); setSize('') }}
              className={`h-8 w-8 rounded-full border ${i === ci ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone' : 'border-ink/20'}`} style={{ background: c.hex }} />)}
          </div>

          <p className="label mt-6">Talla</p>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Talla">
            {SIZES.map((s) => <button key={s} role="radio" aria-checked={size === s} disabled={!stock(s)} onClick={() => { setSize(s); setHint(false) }}
              className={`h-11 border text-sm transition disabled:cursor-not-allowed disabled:text-ink/25 disabled:line-through ${size === s ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>{s}</button>)}
          </div>
          {size && stock(size) <= 3 && <p className="mt-2 text-xs text-sage-deep">¡Solo quedan {stock(size)}!</p>}
          {hint && <p role="alert" className="mt-2 text-xs text-sage-deep">Selecciona una talla para continuar.</p>}
          <button className="btn-dark mt-6 w-full !py-4" onClick={onAdd}>Añadir al carrito</button>

          <div className="mt-10 border-t border-ink/10">
            <div className="flex" role="tablist">
              {TABS.map(([k, label, Icon]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                  className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-4 text-[10px] font-medium uppercase tracking-wide2 transition sm:text-[11px] ${tab === k ? 'border-ink' : 'border-transparent text-ink-500 hover:text-ink'}`}>
                  <Icon className="hidden h-4 w-4 sm:block" />{label}
                </button>
              ))}
            </div>
            <div role="tabpanel" className="py-5 text-sm leading-relaxed text-ink-500">
              <p>{p[tab] || 'Información próximamente.'}</p>
              {tab === 'fit' && (
                <table className="mt-4 w-full border border-ink/10 text-center text-xs"><thead className="bg-ink text-white"><tr>{['Talla', 'EU', 'Cintura (cm)', 'Cadera (cm)'].map((h) => <th key={h} className="p-2 font-medium">{h}</th>)}</tr></thead>
                  <tbody>{SIZE_CHART.map((r) => <tr key={r[0]} className="border-t border-ink/10">{r.map((c, i) => <td key={i} className="p-2">{c}</td>)}</tr>)}</tbody></table>
              )}
            </div>
          </div>
          <p className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wide2 text-sage-deep"><Sparkle className="h-3 w-3" /> Move with purpose</p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-24"><h2 className="mb-8 text-2xl font-bold">Completa tu look</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>
      )}
    </div>
  )
}
