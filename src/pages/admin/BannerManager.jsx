import { useEffect, useState } from 'react'
import { Check, Save } from 'lucide-react'
import { useShop } from '../../store/ShopContext'
import Sparkle from '../../components/Sparkle'

const TONES = [['sage', 'Verde salvia', 'bg-sage-deep text-white'], ['dark', 'Carbón', 'bg-ink text-white'], ['light', 'Blanco', 'bg-white text-ink border border-ink/10']]
const PRESETS = ['Envío gratis por compras mayores a $80 ✦', 'Nueva Colección Disponible ✦', '-15% en tu primer pedido · Código LYRA15 ✦']

export default function BannerManager() {
  const { settings, saveSetting } = useShop()
  const [b, setB] = useState(settings.banner)
  const [s, setS] = useState(settings.store)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  useEffect(() => { setB(settings.banner); setS(settings.store) }, [settings])
  const tone = TONES.find((t) => t[0] === b.tone)?.[2]

  const save = async (e) => {
    e.preventDefault(); setErr('')
    try {
      await saveSetting('banner', b)
      await saveSetting('store', { ...s, whatsapp: String(s.whatsapp).replace(/\D/g, ''), freeShippingFrom: +s.freeShippingFrom || 0 })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (x) { setErr(x.message) }
  }
  return (
    <form onSubmit={save} className="max-w-2xl">
      <h1 className="text-3xl font-bold">Banner y ajustes</h1>
      <p className="mt-1 text-sm text-ink-500">Los cambios se reflejan en vivo en la cabecera de la tienda.</p>

      <p className="label mt-6">Vista previa</p>
      <div className={`flex h-9 items-center justify-center gap-2 text-[11px] uppercase tracking-wide2 ${tone} ${b.enabled ? '' : 'opacity-40'}`}><Sparkle className="h-3 w-3" />{b.text || 'Tu mensaje aquí'}</div>

      <section className="mt-6 grid gap-4 bg-white p-5">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={b.enabled} onChange={(e) => setB({ ...b, enabled: e.target.checked })} /> Mostrar banner</label>
        <div><label className="label" htmlFor="bt">Mensaje</label><input id="bt" className="input" value={b.text} onChange={(e) => setB({ ...b, text: e.target.value })} />
          <div className="mt-2 flex flex-wrap gap-2">{PRESETS.map((t) => <button type="button" key={t} className="border border-ink/15 px-2 py-1 text-[11px] hover:border-ink" onClick={() => setB({ ...b, text: t })}>{t}</button>)}</div></div>
        <div><label className="label" htmlFor="bl">Enlace (opcional)</label><input id="bl" className="input" placeholder="/tienda" value={b.link || ''} onChange={(e) => setB({ ...b, link: e.target.value })} /></div>
        <fieldset><legend className="label">Color</legend><div className="flex gap-4">{TONES.map(([k, l]) => <label key={k} className="flex items-center gap-2 text-sm"><input type="radio" name="tone" checked={b.tone === k} onChange={() => setB({ ...b, tone: k })} />{l}</label>)}</div></fieldset>
      </section>

      <section className="mt-6 grid gap-4 bg-white p-5 sm:grid-cols-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide2 sm:col-span-2">Tienda</h2>
        <div><label className="label" htmlFor="wa">WhatsApp del negocio</label><input id="wa" className="input" placeholder="34600000000" value={s.whatsapp} onChange={(e) => setS({ ...s, whatsapp: e.target.value })} /><p className="mt-1 text-[11px] text-ink-500">Con código de país, sin “+”.</p></div>
        <div><label className="label" htmlFor="fs">Envío gratis desde ($)</label><input id="fs" type="number" min="0" className="input" value={s.freeShippingFrom} onChange={(e) => setS({ ...s, freeShippingFrom: e.target.value })} /></div>
      </section>

      {err && <p role="alert" className="mt-4 text-sm text-red-700">{err}</p>}
      <button className="btn-dark mt-6">{saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Save className="h-4 w-4" /> Publicar cambios</>}</button>
    </form>
  )
}
