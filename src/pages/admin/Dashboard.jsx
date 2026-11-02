import { Link } from 'react-router-dom'
import { AlertTriangle, Boxes, Eye, EyeOff, TrendingUp } from 'lucide-react'
import { useShop } from '../../store/ShopContext'
import { money, totalStock } from '../../lib/format'

export default function Dashboard() {
  const { products } = useShop()
  const active = products.filter((p) => p.active)
  const units = products.reduce((a, p) => a + totalStock(p), 0)
  const value = products.reduce((a, p) => a + totalStock(p) * p.price, 0)
  const low = products.flatMap((p) => p.colors.flatMap((c) => Object.entries(c.stock || {}).filter(([, n]) => +n <= 2).map(([s, n]) => ({ p, c, s, n }))))
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)
  const stats = [
    [Eye, 'Productos activos', active.length], [EyeOff, 'Ocultos', products.length - active.length],
    [Boxes, 'Unidades en stock', units], [TrendingUp, 'Valor de inventario', money(value)],
  ]
  return (
    <div>
      <h1 className="text-3xl font-bold">Resumen</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([Icon, l, v]) => <div key={l} className="bg-white p-5"><Icon className="h-5 w-5 text-sage-deep" /><p className="mt-4 font-display text-3xl font-bold">{v}</p><p className="mt-1 text-[11px] uppercase tracking-wide2 text-ink-500">{l}</p></div>)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="bg-white p-5"><h2 className="text-sm font-semibold uppercase tracking-wide2">Más vendidos</h2>
          <ol className="mt-4 divide-y divide-ink/10 text-sm">{top.map((p) => <li key={p.id} className="flex justify-between py-2"><Link to={`/admin/productos/${p.id}`} className="hover:underline">{p.name}</Link><span className="text-ink-500">{p.sold} uds</span></li>)}</ol></section>
        <section className="bg-white p-5"><h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide2"><AlertTriangle className="h-4 w-4 text-sage-deep" /> Stock bajo ({low.length})</h2>
          {low.length === 0 ? <p className="mt-4 text-sm text-ink-500">Todo en orden ✦</p> :
            <ul className="mt-4 max-h-64 divide-y divide-ink/10 overflow-auto text-sm">{low.map((x, i) => <li key={i} className="flex justify-between py-2"><Link to={`/admin/productos/${x.p.id}`} className="hover:underline">{x.p.name} · {x.c.name} · {x.s}</Link><b className={+x.n === 0 ? 'text-red-700' : ''}>{x.n}</b></li>)}</ul>}</section>
      </div>
    </div>
  )
}
