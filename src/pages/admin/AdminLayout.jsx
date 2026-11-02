import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Megaphone, Package, LogOut, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'
import { isDemo } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Login from './Login'
import { useShop } from '../../store/ShopContext'

export default function AdminLayout() {
  const [session, setSession] = useState(undefined)
  const { reload } = useShop()
  const nav = useNavigate()
  useEffect(() => { api.getSession().then(setSession) }, [])
  if (session === undefined) return <p className="p-10">Cargando…</p>
  if (!session) return <Login onDone={async () => { setSession(await api.getSession()); reload() }} />

  const link = ({ isActive }) => `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wide2 transition ${isActive ? 'bg-white text-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'}`
  return (
    <div className="min-h-screen bg-bone md:flex">
      <aside className="bg-ink text-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center justify-between p-5 md:block"><Logo light tagline className="md:items-start" /><span className="eyebrow !text-sage md:mt-4 md:block">Admin</span></div>
        <nav className="flex md:block" aria-label="Admin">
          <NavLink to="/admin" end className={link}><LayoutDashboard className="h-4 w-4" /><span className="hidden sm:inline">Resumen</span></NavLink>
          <NavLink to="/admin/productos" className={link}><Package className="h-4 w-4" /><span className="hidden sm:inline">Productos</span></NavLink>
          <NavLink to="/admin/banner" className={link}><Megaphone className="h-4 w-4" /><span className="hidden sm:inline">Banner</span></NavLink>
        </nav>
        <div className="hidden p-4 text-xs text-white/50 md:absolute md:bottom-0 md:block md:w-full">
          <p className="truncate">{session.email}</p>
          <Link to="/" className="mt-2 flex items-center gap-2 hover:text-white"><ExternalLink className="h-3 w-3" /> Ver tienda</Link>
          <button className="mt-2 flex items-center gap-2 hover:text-white" onClick={async () => { await api.signOut(); setSession(null); nav('/admin') }}><LogOut className="h-3 w-3" /> Cerrar sesión</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        {isDemo && <p className="mb-6 border border-sage bg-sage-mist px-4 py-2 text-xs">Modo demo: los datos se guardan en este navegador. Conecta Supabase (ver README) para persistencia real.</p>}
        <Outlet />
        <div className="mt-10 flex gap-4 text-xs md:hidden">
          <Link to="/" className="underline">Ver tienda</Link>
          <button className="underline" onClick={async () => { await api.signOut(); setSession(null) }}>Cerrar sesión</button>
        </div>
      </main>
    </div>
  )
}
