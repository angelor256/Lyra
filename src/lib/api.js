// Capa de datos: Supabase si hay credenciales; si no, MODO DEMO con localStorage.
import { supabase, isDemo } from './supabase'
import { seedProducts } from '../data/seed'
import { DEFAULT_SETTINGS } from '../data/constants'
import { uid } from './format'

const LS_P = 'lyra.products.v1'
const LS_S = 'lyra.settings.v1'
const LS_A = 'lyra.admin.session'
const read = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb } }
const write = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); return true }
  catch { throw new Error('Almacenamiento local lleno. Usa URLs de imagen o conecta Supabase.') }
}

// ---- mapeo fila <-> producto
const fromRow = (r) => ({
  id: r.id, name: r.name, description: r.description, price: Number(r.price), comparePrice: r.compare_price ? Number(r.compare_price) : null,
  category: r.category, discipline: r.discipline || [], support: r.support, active: r.active, sold: r.sold,
  fabric: r.fabric, fit: r.fit, care: r.care, colors: r.colors || [], createdAt: new Date(r.created_at).getTime(),
})
const toRow = (p) => ({
  name: p.name, description: p.description, price: p.price, compare_price: p.comparePrice || null, category: p.category,
  discipline: p.discipline, support: p.support, active: p.active, sold: p.sold || 0, fabric: p.fabric, fit: p.fit, care: p.care, colors: p.colors,
})

export const api = {
  async listProducts({ includeHidden = false } = {}) {
    if (isDemo) {
      let list = read(LS_P, null)
      if (!list) { list = seedProducts(); write(LS_P, list) }
      return includeHidden ? list : list.filter((p) => p.active)
    }
    let q = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (!includeHidden) q = q.eq('active', true)
    const { data, error } = await q
    if (error) throw error
    return data.map(fromRow)
  },
  async saveProduct(p) {
    if (isDemo) {
      const list = read(LS_P, seedProducts())
      const i = list.findIndex((x) => x.id === p.id)
      const item = { ...p, id: p.id || uid(), createdAt: p.createdAt || Date.now(), sold: p.sold || 0 }
      if (i >= 0) list[i] = item; else list.unshift(item)
      write(LS_P, list); return item
    }
    const q = p.id
      ? supabase.from('products').update(toRow(p)).eq('id', p.id)
      : supabase.from('products').insert(toRow(p))
    const { data, error } = await q.select().single()
    if (error) throw error
    return fromRow(data)
  },
  async deleteProduct(id) {
    if (isDemo) return write(LS_P, read(LS_P, []).filter((x) => x.id !== id))
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },
  async resetDemo() { localStorage.removeItem(LS_P); localStorage.removeItem(LS_S) },

  async getSettings() {
    if (isDemo) {
      const s = read(LS_S, {})
      return { banner: { ...DEFAULT_SETTINGS.banner, ...s.banner }, store: { ...DEFAULT_SETTINGS.store, ...s.store } }
    }
    const { data } = await supabase.from('settings').select('*')
    const s = Object.fromEntries((data || []).map((r) => [r.key, r.value]))
    return { banner: { ...DEFAULT_SETTINGS.banner, ...s.banner }, store: { ...DEFAULT_SETTINGS.store, ...s.store } }
  },
  async saveSetting(key, value) {
    if (isDemo) { const s = read(LS_S, {}); s[key] = value; return write(LS_S, s) }
    const { error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) throw error
  },
  // Suscripción en vivo a cambios (banner/productos). Devuelve función de limpieza.
  subscribe(cb) {
    if (isDemo) {
      const h = (e) => { if (e.key === LS_S || e.key === LS_P) cb() }
      window.addEventListener('storage', h)
      return () => window.removeEventListener('storage', h)
    }
    const ch = supabase.channel('lyra-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, cb)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, cb)
      .subscribe()
    return () => supabase.removeChannel(ch)
  },

  async uploadImage(file) {
    if (isDemo) return resizeToDataUrl(file)
    const path = `${uid()}-${file.name.replace(/[^\w.-]/g, '_')}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    if (error) throw error
    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
  },

  // ---- Auth admin
  async getSession() {
    if (isDemo) return sessionStorage.getItem(LS_A) ? { demo: true, email: 'admin@lyra.demo' } : null
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    const { data: row } = await supabase.from('admins').select('user_id').eq('user_id', data.session.user.id).maybeSingle()
    return row ? { email: data.session.user.email } : null
  },
  async signIn(email, password) {
    if (isDemo) {
      const pass = import.meta.env.VITE_ADMIN_PASSWORD || 'lyra2025'
      if (password !== pass) throw new Error('Contraseña incorrecta')
      sessionStorage.setItem(LS_A, '1'); return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (!(await api.getSession())) { await supabase.auth.signOut(); throw new Error('Este usuario no tiene permisos de administrador') }
  },
  async signOut() { if (isDemo) sessionStorage.removeItem(LS_A); else await supabase.auth.signOut() },
}

function resizeToDataUrl(file, max = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const r = new FileReader()
    r.onload = () => { img.src = r.result }
    r.onerror = reject
    img.onerror = reject
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = img.width * k; c.height = img.height * k
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      resolve(c.toDataURL('image/jpeg', 0.8))
    }
    r.readAsDataURL(file)
  })
}
