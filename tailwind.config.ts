import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bfe0ff',
          300: '#94cdff',
          400: '#5cb3ff',
          500: '#2c98ff',
          600: '#167be6',
          700: '#1062b4',
          800: '#0f4d8c',
          900: '#0f416f',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'grid': 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '18px 18px',
      }
    },
  },
  plugins: [],
}
export default config
