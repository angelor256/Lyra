import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useShop } from '../store/ShopContext'
import Sparkle from './Sparkle'

const tones = { sage: 'bg-sage-deep text-white', dark: 'bg-ink text-white', light: 'bg-white text-ink border-b border-ink/10' }

export default function AnnouncementBar() {
  const { settings } = useShop()
  const b = settings.banner
  const sig = b.text + b.link
  const [hidden, setHidden] = useState(() => sessionStorage.getItem('lyra.banner') === sig)
  useEffect(() => { setHidden(sessionStorage.getItem('lyra.banner') === sig) }, [sig])
  if (!b.enabled || !b.text || hidden) return null
  const inner = <span className="inline-flex items-center gap-2"><Sparkle className="h-3 w-3" animate />{b.text}</span>
  return (
    <div className={`relative ${tones[b.tone] || tones.sage}`} role="status">
      <div className="container-x flex h-9 items-center justify-center text-[11px] uppercase tracking-wide2">
        {b.link ? <Link to={b.link} className="hover:underline">{inner}</Link> : inner}
        <button aria-label="Cerrar aviso" className="absolute right-3 opacity-70 hover:opacity-100" onClick={() => { sessionStorage.setItem('lyra.banner', sig); setHidden(true) }}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
