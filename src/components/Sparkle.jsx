// Destello de 4 puntas ✦ de la etiqueta LYRA
export default function Sparkle({ className = 'w-4 h-4', animate = false }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} ${animate ? 'animate-twinkle' : ''}`} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.9 7.6 3.4 10.1 12 12-8.6 1.9-11.1 4.4-12 12-.9-7.6-3.4-10.1-12-12C8.6 10.1 11.1 7.6 12 0z" />
    </svg>
  )
}
