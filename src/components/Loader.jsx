import { useEffect, useState } from 'react'
import Sparkle from './Sparkle'

const WORDS = ['Move', 'with', 'purpose']
const MIN_MS = 2600

// Pantalla de carga de marca. Se muestra una vez por sesión.
export default function Loader() {
  const seen = (() => { try { return sessionStorage.getItem('lyra.intro') } catch { return null } })()
  const [phase, setPhase] = useState(seen ? 'gone' : 'in') // in -> out -> gone

  useEffect(() => {
    if (phase !== 'in') return
    document.body.style.overflow = 'hidden'
    const ready = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })))
    const wait = new Promise((r) => setTimeout(r, MIN_MS))
    Promise.all([ready, wait]).then(() => setPhase('out'))
    return () => { document.body.style.overflow = '' }
  }, [phase])

  useEffect(() => {
    if (phase !== 'out') return
    try { sessionStorage.setItem('lyra.intro', '1') } catch {}
    document.body.style.overflow = ''
    const t = setTimeout(() => setPhase('gone'), 1100)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'gone') return null
  const out = phase === 'out'
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="status" aria-live="polite" aria-label="Cargando LYRA">
      {/* Cortinas que se abren al terminar */}
      <div className={`loader-panel top-0 ${out ? '-translate-y-full' : ''}`} />
      <div className={`loader-panel bottom-0 ${out ? 'translate-y-full' : ''}`} />

      <div className={`absolute inset-0 grid place-items-center transition-all duration-700 ${out ? 'scale-110 opacity-0' : ''}`}>
        <div className="loader-glow" />
        <div className="relative flex flex-col items-center px-6 text-center text-white">
          <div className="relative grid h-24 w-24 place-items-center">
            <span className="loader-ring" /><span className="loader-ring [animation-delay:.6s]" />
            <Sparkle className="loader-star h-12 w-12 text-white" />
          </div>
          <h1 className="mt-8 flex font-display text-4xl font-semibold tracking-brand sm:text-6xl" aria-hidden="true">
            {'LYRA'.split('').map((l, i) => <span key={i} className="loader-letter" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>{l}</span>)}
          </h1>
          <div className="loader-line my-6" />
          <p className="flex gap-3 text-[11px] uppercase tracking-[0.4em] text-sage sm:text-sm" aria-hidden="true">
            {WORDS.map((w, i) => <span key={w} className="loader-word" style={{ animationDelay: `${1.3 + i * 0.28}s` }}>{w}</span>)}
          </p>
          <p className="loader-sub mt-5 text-xs text-white/50">Más que ropa deportiva, un estilo de vida.</p>
          <div className="mt-10 h-px w-40 overflow-hidden bg-white/10"><div className="loader-bar h-full bg-sage" /></div>
        </div>
      </div>
    </div>
  )
}
