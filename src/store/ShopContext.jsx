import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { DEFAULT_SETTINGS } from '../data/constants'

const Ctx = createContext(null)
export const useShop = () => useContext(Ctx)

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]) // incluye ocultos solo si hay sesión admin
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const session = await api.getSession()
      const [p, s] = await Promise.all([api.listProducts({ includeHidden: !!session }), api.getSettings()])
      setProducts(p); setSettings(s); setError('')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }, [])

  useEffect(() => { load(); return api.subscribe(load) }, [load])

  const actions = useMemo(() => ({
    reload: load,
    saveProduct: async (p) => { const r = await api.saveProduct(p); await load(); return r },
    deleteProduct: async (id) => { await api.deleteProduct(id); await load() },
    toggleProduct: async (p) => { await api.saveProduct({ ...p, active: !p.active }); await load() },
    saveSetting: async (k, v) => { await api.saveSetting(k, v); await load() },
  }), [load])

  const value = { products, settings, loading, error, ...actions }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
