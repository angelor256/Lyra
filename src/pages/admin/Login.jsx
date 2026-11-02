import { useState } from 'react'
import { api } from '../../lib/api'
import { isDemo } from '../../lib/supabase'
import Logo from '../../components/Logo'

export default function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await api.signIn(email, password); await onDone() } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-bone p-8">
        <div className="mb-8 text-center"><Logo tagline /><p className="eyebrow mt-6">Acceso administrador</p></div>
        {!isDemo && <div className="mb-4"><label className="label" htmlFor="em">Email</label><input id="em" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></div>}
        <div className="mb-4"><label className="label" htmlFor="pw">Contraseña</label><input id="pw" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></div>
        {err && <p role="alert" className="mb-4 text-sm text-red-700">{err}</p>}
        <button className="btn-dark w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
        {isDemo && <p className="mt-4 text-center text-[11px] text-ink-500">Modo demo · contraseña por defecto: <code>lyra2025</code></p>}
      </form>
    </div>
  )
}
