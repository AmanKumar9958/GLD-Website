import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#FAF9F6',
          DEFAULT: '#F8FAFC',
          warm: '#F5F2EB',
          dark: '#0A1128',
          card: '#FFFFFF'
        },
        primary: {
          50: '#F0F4FA',
          100: '#D9E3F3',
          DEFAULT: '#0A1128',
          light: '#14234C',
          dark: '#050A1A',
          charcoal: '#0F172A',
        },
        accent: {
          amber: '#F59E0B',
          gold: '#D97706',
          emerald: '#059669',
          mint: '#10B981',
          blue: '#2563EB',
          crimson: '#DC2626'
        },
        border: {
          subtle: '#E2E8F0',
          medium: '#CBD5E1'
        }
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        heading: ['Outfit', ...fontFamily.sans],
        body: ['Inter', ...fontFamily.sans]
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'premium': '0 10px 30px -10px rgba(10, 17, 40, 0.08), 0 4px 6px -2px rgba(10, 17, 40, 0.04)',
        'elevated': '0 20px 40px -15px rgba(10, 17, 40, 0.12)',
        'gold-glow': '0 0 25px -5px rgba(245, 158, 11, 0.3)'
      }
    },
  },
  plugins: [],
}