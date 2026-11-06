import { Link } from 'react-router-dom'
import Logo from './Logo'
import Sparkle from './Sparkle'
import { CATEGORIES } from '../data/constants'

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light tagline className="items-start" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">Más que ropa deportiva, un estilo de vida.</p>
        </div>
        <div>
          <h4 className="eyebrow !text-sage">Comprar</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {CATEGORIES.map((c) => <li key={c}><Link className="hover:text-white" to={`/tienda?cat=${encodeURIComponent(c)}`}>{c}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow !text-sage">Marca</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link className="hover:text-white" to="/manifiesto">Manifiesto</Link></li>
            <li><Link className="hover:text-white" to="/tienda">Novedades</Link></li>
            <li><Link className="hover:text-white" to="/admin">Acceso admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[11px] uppercase tracking-wide2 text-white/40">
        <Sparkle className="mr-2 inline h-3 w-3" /> © {new Date().getFullYear()} LYRA · Move with purpose
        <p className="mt-3 normal-case tracking-normal">
          Creado por{' '}
          <a href="https://angelor256.github.io/buildbeetech/#inicio" target="_blank" rel="noopener noreferrer"
            className="font-medium text-sage underline-offset-4 transition hover:text-white hover:underline">Buildbee</a>
        </p>
      </div>
    </footer>
  )
}
