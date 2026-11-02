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
      <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center justify-self-start">
        <button className="-ml-2 p-2 xl:hidden" aria-label="Menú" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        <nav className="hidden items-center gap-5 whitespace-nowrap xl:flex 2xl:gap-7" aria-label="Principal">
          <NavLink to="/tienda" end className={link}>Tienda</NavLink>
          {CATEGORIES.slice(0, 4).map((c, i) => <Link key={c} to={`/tienda?cat=${encodeURIComponent(c)}`} className={`${i === 3 ? 'hidden 2xl:inline' : ''} text-[11px] uppercase tracking-wide2 hover:text-sage-deep`}>{c}</Link>)}
          <NavLink to="/manifiesto" className={link}>Manifiesto</NavLink>
        </nav></div>
        <Logo />
        <div className="flex items-center justify-self-end gap-1 sm:gap-3">
          <form onSubmit={submit} className={`${searching ? 'flex' : 'hidden'} absolute inset-x-0 top-0 z-10 h-16 items-center gap-3 bg-bone px-4 xl:static xl:inset-auto xl:flex xl:h-auto xl:bg-transparent xl:px-0`} role="search">
            <Search className="h-4 w-4 shrink-0 text-ink-500" />
            <input autoFocus={searching} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar prendas…" aria-label="Buscar"
              className="w-full border-b border-ink/20 bg-transparent py-1 text-sm outline-none focus:border-ink xl:w-32 2xl:w-44" />
            <button type="button" className="xl:hidden" aria-label="Cerrar búsqueda" onClick={() => setSearching(false)}><X className="h-5 w-5" /></button>
          </form>
          <button className="p-2 xl:hidden" aria-label="Buscar" onClick={() => setSearching(true)}><Search className="h-5 w-5" /></button>
          <button className="relative p-2" aria-label={`Carrito, ${count} artículos`} onClick={() => setOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-sage-deep px-1 text-[10px] font-semibold text-white">{count}</span>}
          </button>
        </div>
      </div>
      {menu && (
        <nav className="border-t border-ink/10 bg-bone px-4 py-4 xl:hidden" aria-label="Móvil">
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
