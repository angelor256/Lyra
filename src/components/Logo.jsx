import { Link } from 'react-router-dom'
import Sparkle from './Sparkle'

export default function Logo({ light = false, tagline = false, className = '' }) {
  return (
    <Link to="/" aria-label="LYRA — inicio" className={`inline-flex flex-col items-center ${light ? 'text-white' : 'text-ink'} ${className}`}>
      <span className="font-display text-xl font-semibold leading-none tracking-brand pl-[0.32em] sm:text-2xl">LYRA</span>
      {tagline && <span className="mt-1 text-[8px] uppercase tracking-[0.35em] opacity-70">Move with purpose</span>}
    </Link>
  )
}
export const LogoMark = ({ className = 'w-24 h-24' }) => (
  <div className={`${className} grid place-items-center rounded-full bg-[radial-gradient(circle_at_50%_40%,#3a3a3a,#121212_65%)] text-white`}>
    <span className="font-display text-xl font-medium tracking-brand pl-[0.32em]">LYRA</span>
  </div>
)
export { Sparkle }
