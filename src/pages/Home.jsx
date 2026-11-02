import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Wind, Leaf } from 'lucide-react'
import { useShop } from '../store/ShopContext'
import ProductCard from '../components/ProductCard'
import Sparkle from '../components/Sparkle'
import { CATEGORIES, DISCIPLINES } from '../data/constants'
import { garmentImage } from '../lib/placeholder'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,#2b3029_0%,#121212_60%)]" />
      <div className="absolute -right-24 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-sage/20 blur-3xl" />
      <Sparkle className="absolute right-[12%] top-[18%] -z-10 h-10 w-10 text-sage opacity-60" animate />
      <Sparkle className="absolute right-[30%] bottom-[18%] -z-10 h-5 w-5 text-white opacity-40" animate />
      <div className="container-x grid min-h-[78vh] items-center gap-10 py-20 lg:grid-cols-2">
        <div className="animate-fadeUp">
          <p className="eyebrow !text-sage">Colección 2026 · Activewear premium</p>
          <h1 className="mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            Move<br />with<br /><span className="text-sage">purpose</span>
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/70">Más que ropa deportiva, un estilo de vida. Tejidos técnicos, diseño depurado y un propósito en cada movimiento.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/tienda" className="btn-light">Comprar ahora <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/manifiesto" className="btn border border-white/40 text-white hover:bg-white hover:text-ink">Nuestro manifiesto</Link>
          </div>
        </div>
        <div className="relative hidden h-[30rem] lg:block">
          <img src={garmentImage('Leggings', '#8A9A86', 0)} alt="" className="absolute right-0 top-0 h-[26rem] w-72 rotate-3 object-cover shadow-2xl" />
          <img src={garmentImage('Bras deportivos', '#161616', 1)} alt="" className="absolute bottom-0 left-4 h-72 w-56 -rotate-3 object-cover shadow-2xl ring-1 ring-white/10" />
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-[11px] uppercase tracking-brand text-white/50">✦ Pilates ✦ Gym ✦ Running ✦ Casual ✦</div>
    </section>
  )
}

export function Manifesto({ full = false }) {
  const pillars = [
    [Zap, 'Rendimiento', 'Compresión, soporte y libertad de movimiento, probados en cada disciplina.'],
    [Wind, 'Sensación', 'Tejidos brushed y sin costuras: una segunda piel que desaparece al moverte.'],
    [Leaf, 'Propósito', 'Materiales reciclados y producción en lotes cortos. Menos, pero mejor.'],
  ]
  return (
    <section className="bg-sage-mist py-24">
      <div className="container-x text-center">
        <Sparkle className="mx-auto h-8 w-8 text-sage-deep" animate />
        <p className="eyebrow mt-6">El Manifiesto</p>
        <blockquote className="mx-auto mt-6 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
          “Más que ropa deportiva, <span className="text-sage-deep">un estilo de vida.</span>”
        </blockquote>
        {full && <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-ink-500">LYRA nace de una idea simple: el movimiento no es solo ejercicio, es la forma en que habitas tu día. Diseñamos prendas que acompañan cada versión de ti —la que entrena a las 6 a. m., la que respira en una clase de pilates, la que sale a caminar sin destino— con la misma exigencia técnica y la misma elegancia silenciosa. Como la constelación que nos da nombre, cada punto de luz importa.</p>}
        <div className="mx-auto mt-14 grid max-w-4xl gap-px bg-ink/10 sm:grid-cols-3">
          {pillars.map(([Icon, t, d]) => (
            <div key={t} className="group bg-sage-mist p-8 transition hover:bg-ink hover:text-white">
              <Icon className="mx-auto h-6 w-6 text-sage-deep transition group-hover:text-sage" />
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide2">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { products, loading } = useShop()
  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4)
  return (
    <>
      <Hero />
      <section className="container-x py-20">
        <div className="mb-10 flex items-end justify-between">
          <div><p className="eyebrow">Explora por disciplina</p><h2 className="mt-2 text-3xl font-bold">Elige tu movimiento</h2></div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {DISCIPLINES.map((d, i) => (
            <Link key={d} to={`/tienda?disc=${d}`} className="group relative flex aspect-[3/4] items-end overflow-hidden bg-ink p-5 text-white">
              <img src={garmentImage(CATEGORIES[(i * 2) % 6], ['#8A9A86', '#161616', '#7B8C7A', '#4A4D4B'][i], 1)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
              <div className="relative flex w-full items-center justify-between"><span className="font-display text-lg font-semibold uppercase">{d}</span><ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
            </Link>
          ))}
        </div>
      </section>
      <section className="container-x pb-10">
        <div className="mb-10 flex items-end justify-between">
          <div><p className="eyebrow">Favoritas de la comunidad</p><h2 className="mt-2 text-3xl font-bold">Más vendidos</h2></div>
          <Link to="/tienda" className="text-xs uppercase tracking-wide2 underline">Ver todo</Link>
        </div>
        {loading ? <p>Cargando…</p> : <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">{best.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </section>
      <Manifesto />
    </>
  )
}
