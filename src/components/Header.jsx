import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo'
import { useCart } from '../store/CartContext'
import { CATEGORIES } from '../data/constants'

export default function Header() {
  const { count, setOpen } = useCart()
  const nav = useNavigate()
  const [menu, setMenu] = useState(false)
  const [searching, setSearching] = useState(false)
  const [q, setQ] = useState('')
  const submit = (e) => { e.preventDefault(); nav(`/tienda${q ? `?q=${encodeURIComponent(q)}` : ''}`); setSearching(false); setMenu(false) }
  const link = ({ isActive }) => `text-[11px] uppercase tracking-wide2 transition hover:text-sage-deep ${isActive ? 'text-sage-deep' : ''}`

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <button className="lg:hidden" aria-label="Menú" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          <NavLink to="/tienda" end className={link}>Tienda</NavLink>
          {CATEGORIES.slice(0, 4).map((c) => <Link key={c} to={`/tienda?cat=${encodeURIComponent(c)}`} className="text-[11px] uppercase tracking-wide2 hover:text-sage-deep">{c}</Link>)}
          <NavLink to="/manifiesto" className={link}>Manifiesto</NavLink>
        </nav>
        <Logo className="absolute left-1/2 -translate-x-1/2" />
        <div className="flex items-center gap-1 sm:gap-3">
          <form onSubmit={submit} className={`${searching ? 'flex' : 'hidden'} absolute inset-x-0 top-0 z-10 h-16 items-center gap-3 bg-bone px-4 lg:static lg:inset-auto lg:flex lg:h-auto lg:bg-transparent lg:px-0`} role="search">
            <Search className="h-4 w-4 shrink-0 text-ink-500" />
            <input autoFocus={searching} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar prendas…" aria-label="Buscar"
              className="w-full border-b border-ink/20 bg-transparent py-1 text-sm outline-none focus:border-ink lg:w-44" />
            <button type="button" className="lg:hidden" aria-label="Cerrar búsqueda" onClick={() => setSearching(false)}><X className="h-5 w-5" /></button>
          </form>
          <button className="p-2 lg:hidden" aria-label="Buscar" onClick={() => setSearching(true)}><Search className="h-5 w-5" /></button>
          <button className="relative p-2" aria-label={`Carrito, ${count} artículos`} onClick={() => setOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-sage-deep px-1 text-[10px] font-semibold text-white">{count}</span>}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="border-t border-ink/10 bg-bone px-4 py-4 lg:hidden" aria-label="Móvil">
          <ul className="space-y-3 text-xs uppercase tracking-wide2">
            <li><Link to="/tienda" onClick={() => setMenu(false)}>Toda la tienda</Link></li>
            {CATEGORIES.map((c) => <li key={c}><Link to={`/tienda?cat=${encodeURIComponent(c)}`} onClick={() => setMenu(false)}>{c}</Link></li>)}
            <li><Link to="/manifiesto" onClick={() => setMenu(false)}>Manifiesto</Link></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
