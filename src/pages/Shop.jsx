import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useShop } from '../store/ShopContext'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, DISCIPLINES, SIZES, SORTS, SUPPORT_LEVELS } from '../data/constants'

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

function Group({ title, children }) {
  return <fieldset className="border-b border-ink/10 py-5"><legend className="eyebrow !text-ink mb-3 float-left w-full">{title}</legend><div className="clear-both flex flex-wrap gap-2">{children}</div></fieldset>
}
const Chip = ({ on, onClick, children }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className={`border px-3 py-1.5 text-xs transition ${on ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>{children}</button>
)

export default function Shop() {
  const { products, loading, error } = useShop()
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') || ''
  const [cats, setCats] = useState(sp.get('cat') ? [sp.get('cat')] : [])
  const [discs, setDiscs] = useState(sp.get('disc') ? [sp.get('disc')] : [])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [supports, setSupports] = useState([])
  const [sort, setSort] = useState('new')
  const [panel, setPanel] = useState(false)

  // Sincroniza con la URL cuando cambia la categoría/disciplina/búsqueda desde el header
  const urlCat = sp.get('cat'), urlDisc = sp.get('disc')
  useEffect(() => { setCats(urlCat ? [urlCat] : []); setDiscs(urlDisc ? [urlDisc] : []) }, [urlCat, urlDisc])

  const allColors = useMemo(() => [...new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c.hex]))], [products])

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    const r = products.filter((p) =>
      (!t || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(t)) &&
      (!cats.length || cats.includes(p.category)) &&
      (!discs.length || p.discipline.some((d) => discs.includes(d))) &&
      (!supports.length || supports.includes(p.support)) &&
      (!colors.length || p.colors.some((c) => colors.includes(c.name))) &&
      (!sizes.length || p.colors.some((c) => sizes.some((s) => (+c.stock?.[s] || 0) > 0))))
    const by = { new: (a, b) => b.createdAt - a.createdAt, best: (a, b) => b.sold - a.sold, 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price }
    return r.sort(by[sort])
  }, [products, q, cats, discs, supports, colors, sizes, sort])

  const active = cats.length + discs.length + sizes.length + colors.length + supports.length
  const clear = () => { setCats([]); setDiscs([]); setSizes([]); setColors([]); setSupports([]); setSp({}) }

  const filters = (
    <>
      <Group title="Categoría">{CATEGORIES.map((c) => <Chip key={c} on={cats.includes(c)} onClick={() => setCats(toggle(cats, c))}>{c}</Chip>)}</Group>
      <Group title="Disciplina">{DISCIPLINES.map((c) => <Chip key={c} on={discs.includes(c)} onClick={() => setDiscs(toggle(discs, c))}>{c}</Chip>)}</Group>
      <Group title="Talla">{SIZES.map((c) => <Chip key={c} on={sizes.includes(c)} onClick={() => setSizes(toggle(sizes, c))}>{c}</Chip>)}</Group>
      <Group title="Color">{allColors.map(([n, hex]) => (
        <button key={n} type="button" aria-pressed={colors.includes(n)} aria-label={n} title={n} onClick={() => setColors(toggle(colors, n))}
          className={`h-7 w-7 rounded-full border transition ${colors.includes(n) ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone' : 'border-ink/20'}`} style={{ background: hex }} />
      ))}</Group>
      <Group title="Nivel de soporte">{SUPPORT_LEVELS.map((c) => <Chip key={c} on={supports.includes(c)} onClick={() => setSupports(toggle(supports, c))}>{c}</Chip>)}</Group>
      {active > 0 && <button onClick={clear} className="mt-4 text-xs uppercase tracking-wide2 underline">Limpiar filtros ({active})</button>}
    </>
  )

  return (
    <div className="container-x py-10">
      <p className="eyebrow">Colección</p>
      <h1 className="mt-2 text-4xl font-bold">{q ? `Resultados para “${q}”` : cats.length === 1 ? cats[0] : 'Toda la tienda'}</h1>
      <div className="mt-8 flex items-center justify-between border-y border-ink/10 py-3">
        <button className="flex items-center gap-2 text-xs uppercase tracking-wide2 lg:hidden" onClick={() => setPanel(true)}><SlidersHorizontal className="h-4 w-4" /> Filtros {active > 0 && `(${active})`}</button>
        <p className="hidden text-sm text-ink-500 lg:block">{list.length} prendas</p>
        <label className="flex items-center gap-2 text-xs"><span className="uppercase tracking-wide2 text-ink-500">Ordenar</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-ink/15 bg-white px-2 py-1.5 text-sm">{SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
        </label>
      </div>
      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filtros">{filters}</aside>
        <div>
          {error && <p className="text-red-700">{error}</p>}
          {loading ? <p>Cargando…</p> : list.length === 0 ? (
            <div className="py-20 text-center"><p className="font-display text-xl">No encontramos prendas con esos filtros</p><button onClick={clear} className="btn-outline mt-6">Limpiar filtros</button></div>
          ) : <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
        </div>
      </div>
      {panel && (
        <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-ink/50" onClick={() => setPanel(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-full animate-slideIn overflow-y-auto bg-bone p-5">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-wide2">Filtros</h2><button aria-label="Cerrar" onClick={() => setPanel(false)}><X /></button></div>
            {filters}
            <button className="btn-dark mt-6 w-full" onClick={() => setPanel(false)}>Ver {list.length} prendas</button>
          </div>
        </div>
      )}
    </div>
  )
}
