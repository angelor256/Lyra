/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Negro mate / carbón (etiqueta física y logo circular)
        ink: { DEFAULT: '#121212', soft: '#1A1A1A', 700: '#262626', 600: '#333333', 500: '#4A4A4A' },
        // Verde salvia / eucalipto (textil de fondo de la etiqueta)
        sage: { DEFAULT: '#8A9A86', deep: '#7B8C7A', light: '#B4C0B1', mist: '#E3E8E1' },
        // Blanco pulido y gris neutro claro
        chalk: '#FFFFFF',
        bone: '#F4F4F0',
      },
      fontFamily: {
        display: ['Syne', 'Montserrat', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { brand: '0.32em', wide2: '0.18em' },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'none' } },
        slideIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'none' } },
        twinkle: { '0%,100%': { opacity: 0.35, transform: 'scale(.85) rotate(0)' }, '50%': { opacity: 1, transform: 'scale(1.1) rotate(15deg)' } },
      },
      animation: {
        fadeUp: 'fadeUp .7s ease both',
        slideIn: 'slideIn .3s ease both',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
