import type { Config } from 'tailwindcss';

/**
 * Sistema visual Primera Llave.
 * Latón (color de marca y acción) · Bosque noche (institucional) · Marfil (base) · Arena (calidez) · Grafito (texto).
 * Copihue queda solo para avisos y errores.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marfil: { DEFAULT: '#F7F3EC', 50: '#FBF9F5', 100: '#F7F3EC', 200: '#EFE8DC' },
        arena: { DEFAULT: '#E4D7C3', 100: '#F1E9DC', 200: '#E4D7C3', 300: '#D2BF9F', 400: '#B79E78' },
        bosque: { DEFAULT: '#1F3B2E', 50: '#E9EFEA', 100: '#CFDCD3', 300: '#7F9D8A', 500: '#3D6150', 700: '#26473A', 800: '#1F3B2E', 900: '#0F2A22', 950: '#0A1F19' },
        grafito: { DEFAULT: '#25292A', 400: '#6E7573', 500: '#565D5B', 700: '#383E3E', 900: '#1A1D1E' },
        laton: { DEFAULT: '#F2B33D', 50: '#FDF4E1', 100: '#FBE7BD', 300: '#F7CD73', 400: '#F5C055', 600: '#D99A22', 700: '#8F6110', 800: '#6E4A0C' },
        copihue: { DEFAULT: '#B3412B', 50: '#FBEDE8', 400: '#CE5A3F', 600: '#9C3522', 700: '#832B1B' },
      },
      fontFamily: {
        display: ['var(--fuente-display)', 'Georgia', 'serif'],
        sans: ['var(--fuente-texto)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.9rem, 7.4vw, 6.6rem)', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.3rem, 4.8vw, 4.3rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.85rem, 3.2vw, 2.85rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
      },
      borderRadius: { '4xl': '2rem' },
      boxShadow: {
        suave: '0 1px 2px rgba(20,40,32,.04), 0 8px 24px -12px rgba(20,40,32,.18)',
        elevada: '0 2px 4px rgba(20,40,32,.05), 0 24px 48px -20px rgba(20,40,32,.35)',
      },
      transitionTimingFunction: { suave: 'cubic-bezier(.22,1,.36,1)' },
      keyframes: {
        'zoom-lento': { from: { transform: 'scale(1.08)' }, to: { transform: 'scale(1)' } },
        aparecer: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'none' } },
        desplazar: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(6px)' } },
      },
      animation: {
        'zoom-lento': 'zoom-lento 2.4s cubic-bezier(.22,1,.36,1) both',
        aparecer: 'aparecer .9s cubic-bezier(.22,1,.36,1) both',
        desplazar: 'desplazar 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
