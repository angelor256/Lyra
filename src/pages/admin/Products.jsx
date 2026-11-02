import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useShop } from '../../store/ShopContext'
import { api } from '../../lib/api'
import { isDemo } from '../../lib/supabase'
import { money, totalStock } from '../../lib/format'

export default function Products() {
  const { products, toggleProduct, deleteProduct, reload } = useShop()
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState('')
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
  const run = async (id, fn) => { setBusy(id); try { await fn() } catch (e) { alert(e.message) } finally { setBusy('') } }
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Productos <span className="text-base font-normal text-ink-500">({products.length})</span></h1>
        <div className="flex gap-2">
          {isDemo && <button className="btn-outline" onClick={async () => { if (confirm('¿Restaurar catálogo de ejemplo? Se perderán tus cambios.')) { await api.resetDemo(); reload() } }}><RotateCcw className="h-4 w-4" /> Restaurar demo</button>}
          <Link to="/admin/productos/nuevo" className="btn-dark"><Plus className="h-4 w-4" /> Nueva prenda</Link>
        </div>
      </div>
      <input className="input mt-6 max-w-sm" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar productos" />
      <div className="mt-4 overflow-x-auto bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-wide2 text-ink-500"><tr>{['', 'Prenda', 'Categoría', 'Precio', 'Stock', 'Estado', ''].map((h, i) => <th key={i} className="p-3 font-medium">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-ink/10">
            {list.map((p) => (
              <tr key={p.id} className={`${p.active ? '' : 'opacity-50'} ${busy === p.id ? 'pointer-events-none animate-pulse' : ''}`}>
                <td className="p-3"><img src={p.colors[0]?.images?.[0]} alt="" className="h-14 w-11 bg-bone object-cover" /></td>
                <td className="p-3"><p className="font-medium">{p.name}</p><p className="text-xs text-ink-500">{p.colors.length} colores · {p.discipline.join(', ')}</p></td>
                <td className="p-3">{p.category}</td><td className="p-3">{money(p.price)}</td>
                <td className={`p-3 ${totalStock(p) < 10 ? 'font-semibold text-red-700' : ''}`}>{totalStock(p)}</td>
                <td className="p-3"><span className={`px-2 py-1 text-[10px] uppercase tracking-wide2 ${p.active ? 'bg-sage-mist text-sage-deep' : 'bg-ink/10'}`}>{p.active ? 'Activo' : 'Oculto'}</span></td>
                <td className="p-3"><div className="flex justify-end gap-1">
                  <Link aria-label="Editar" title="Editar" to={`/admin/productos/${p.id}`} className="p-2 hover:bg-bone"><Pencil className="h-4 w-4" /></Link>
                  <button aria-label={p.active ? 'Ocultar' : 'Activar'} title={p.active ? 'Ocultar' : 'Activar'} className="p-2 hover:bg-bone" onClick={() => run(p.id, () => toggleProduct(p))}>{p.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  <button aria-label="Eliminar" title="Eliminar" className="p-2 hover:bg-bone hover:text-red-700" onClick={() => confirm(`¿Eliminar “${p.name}”? No se puede deshacer.`) && run(p.id, () => deleteProduct(p.id))}><Trash2 className="h-4 w-4" /></button>
                </div></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-ink-500">Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
