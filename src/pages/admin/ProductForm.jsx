import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { useShop } from '../../store/ShopContext'
import { api } from '../../lib/api'
import { CATEGORIES, COLOR_PRESETS, DISCIPLINES, SIZES, SUPPORT_LEVELS } from '../../data/constants'
import { garmentImage } from '../../lib/placeholder'

const blank = () => ({
  name: '', description: '', price: '', comparePrice: '', category: CATEGORIES[0], discipline: ['Gym'], support: 'Medio', active: true,
  fabric: '', fit: '', care: 'Lavar a máquina en frío (30°C) del revés. No usar suavizante ni lejía. Secar al aire.',
  colors: [{ name: 'Negro', hex: '#161616', images: ['', ''], stock: Object.fromEntries(SIZES.map((s) => [s, 0])) }],
})

export default function ProductForm() {
  const { id } = useParams()
  const { products, saveProduct } = useShop()
  const nav = useNavigate()
  const existing = id ? products.find((p) => p.id === id) : null
  const [p, setP] = useState(() => (existing ? structuredClone(existing) : blank()))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  if (id && !existing) return <p>Producto no encontrado. <Link className="underline" to="/admin/productos">Volver</Link></p>

  const set = (k, v) => setP((x) => ({ ...x, [k]: v }))
  const setColor = (i, patch) => setP((x) => ({ ...x, colors: x.colors.map((c, j) => (j === i ? { ...c, ...patch } : c)) }))
  const addColor = () => setP((x) => ({ ...x, colors: [...x.colors, { name: 'Verde Salvia', hex: '#8A9A86', images: ['', ''], stock: Object.fromEntries(SIZES.map((s) => [s, 0])) }] }))
  const upload = async (ci, ii, file) => {
    if (!file) return
    try { const url = await api.uploadImage(file); const imgs = [...p.colors[ci].images]; imgs[ii] = url; setColor(ci, { images: imgs }) } catch (e) { setErr(e.message) }
  }

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (!p.discipline.length) return setErr('Selecciona al menos una disciplina.')
    if (!p.colors.length) return setErr('Añade al menos una variante de color.')
    setSaving(true)
    try {
      const out = {
        ...p, price: +p.price, comparePrice: p.comparePrice ? +p.comparePrice : null,
        // Si no se subió imagen, genera una ilustración de marca
        colors: p.colors.map((c) => ({ ...c, stock: Object.fromEntries(SIZES.map((s) => [s, Math.max(0, parseInt(c.stock[s]) || 0)])),
          images: [c.images[0] || garmentImage(p.category, c.hex, 0), c.images[1] || garmentImage(p.category, c.hex, 1)] })),
      }
      await saveProduct(out); nav('/admin/productos')
    } catch (x) { setErr(x.message); setSaving(false) }
  }

  return (
    <form onSubmit={submit} className="max-w-4xl">
      <Link to="/admin/productos" className="flex items-center gap-1 text-xs uppercase tracking-wide2 text-ink-500 hover:text-ink"><ArrowLeft className="h-3 w-3" /> Productos</Link>
      <h1 className="mt-2 text-3xl font-bold">{existing ? 'Editar prenda' : 'Nueva prenda'}</h1>

      <section className="mt-6 grid gap-4 bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label" htmlFor="n">Nombre</label><input id="n" required className="input" value={p.name} onChange={(e) => set('name', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="d">Descripción</label><textarea id="d" rows={3} className="input" value={p.description} onChange={(e) => set('description', e.target.value)} /></div>
        <div><label className="label" htmlFor="pr">Precio (₡)</label><input id="pr" required type="number" min="0" step="500" className="input" value={p.price} onChange={(e) => set('price', e.target.value)} /></div>
        <div><label className="label" htmlFor="cp">Precio anterior (opcional)</label><input id="cp" type="number" min="0" step="500" className="input" value={p.comparePrice || ''} onChange={(e) => set('comparePrice', e.target.value)} /></div>
        <div><label className="label" htmlFor="c">Categoría</label><select id="c" className="input" value={p.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label" htmlFor="s">Nivel de soporte</label><select id="s" className="input" value={p.support} onChange={(e) => set('support', e.target.value)}>{SUPPORT_LEVELS.map((c) => <option key={c}>{c}</option>)}</select></div>
        <fieldset className="sm:col-span-2"><legend className="label">Disciplinas</legend>
          <div className="flex flex-wrap gap-4">{DISCIPLINES.map((d) => <label key={d} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.discipline.includes(d)} onChange={() => set('discipline', p.discipline.includes(d) ? p.discipline.filter((x) => x !== d) : [...p.discipline, d])} />{d}</label>)}</div></fieldset>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={p.active} onChange={(e) => set('active', e.target.checked)} /> Visible en la tienda</label>
      </section>

      <section className="mt-6 grid gap-4 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide2">Fichas técnicas</h2>
        {[['fabric', 'Tecnología de la Tela'], ['fit', 'Guía de Ajuste'], ['care', 'Cuidado de la Prenda']].map(([k, l]) => (
          <div key={k}><label className="label" htmlFor={k}>{l}</label><textarea id={k} rows={2} className="input" value={p[k]} onChange={(e) => set(k, e.target.value)} /></div>))}
      </section>

      <section className="mt-6 space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-semibold uppercase tracking-wide2">Variantes de color y stock</h2>
          <button type="button" className="btn-outline !py-2" onClick={addColor}><Plus className="h-4 w-4" /> Color</button></div>
        {p.colors.map((c, i) => (
          <div key={i} className="bg-white p-5">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-40 flex-1"><label className="label">Nombre del color</label>
                <input className="input" list="presets" required value={c.name} onChange={(e) => { const pr = COLOR_PRESETS.find((x) => x.name === e.target.value); setColor(i, pr ? { name: pr.name, hex: pr.hex } : { name: e.target.value }) }} />
                <datalist id="presets">{COLOR_PRESETS.map((x) => <option key={x.name} value={x.name} />)}</datalist></div>
              <div><label className="label">Tono</label><input type="color" aria-label="Tono" className="h-[42px] w-14 cursor-pointer border border-ink/15 bg-white p-1" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} /></div>
              <button type="button" aria-label="Quitar color" disabled={p.colors.length === 1} className="p-2.5 hover:text-red-700 disabled:opacity-30" onClick={() => setP((x) => ({ ...x, colors: x.colors.filter((_, j) => j !== i) }))}><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {SIZES.map((s) => <div key={s}><label className="label text-center" htmlFor={`st${i}${s}`}>{s}</label><input id={`st${i}${s}`} type="number" min="0" className="input text-center" value={c.stock[s] ?? 0} onChange={(e) => setColor(i, { stock: { ...c.stock, [s]: e.target.value } })} /></div>)}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[0, 1].map((ii) => (
                <div key={ii} className="flex gap-3">
                  <div className="h-24 w-20 shrink-0 bg-bone">{c.images[ii] && <img src={c.images[ii]} alt="" className="h-full w-full object-cover" />}</div>
                  <div className="min-w-0 flex-1"><label className="label">{ii ? 'Imagen hover' : 'Imagen principal'}</label>
                    <input className="input !py-1.5 text-xs" placeholder="URL de imagen" value={c.images[ii]?.startsWith('data:') ? '(imagen incrustada)' : c.images[ii] || ''} readOnly={c.images[ii]?.startsWith('data:')}
                      onChange={(e) => { const im = [...c.images]; im[ii] = e.target.value; setColor(i, { images: im }) }} />
                    <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs underline"><ImagePlus className="h-3.5 w-3.5" /> Subir<input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(i, ii, e.target.files[0])} /></label>
                    {c.images[ii] && <button type="button" className="ml-3 text-xs underline" onClick={() => { const im = [...c.images]; im[ii] = ''; setColor(i, { images: im }) }}>Quitar</button>}
                  </div>
                </div>))}
            </div>
            <p className="mt-2 text-[11px] text-ink-500">Si no subes imágenes, se genera una ilustración con la paleta de marca.</p>
          </div>
        ))}
      </section>

      {err && <p role="alert" className="mt-4 text-sm text-red-700">{err}</p>}
      <div className="sticky bottom-0 mt-6 flex gap-3 bg-bone/90 py-4 backdrop-blur"><button className="btn-dark" disabled={saving}>{saving ? 'Guardando…' : 'Guardar prenda'}</button><Link to="/admin/productos" className="btn-outline">Cancelar</Link></div>
    </form>
  )
}
