import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A1128',
          light: '#1c2e64',
          dark: '#030712'
        },
        red: {
          DEFAULT: '#DC2626',
          light: '#EF4444',
          dark: '#991B1B'
        },
        accent: {
          green: '#10B981',
          amber: '#F59E0B',
          gold: '#FBBF24',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        heading: ['Outfit', ...fontFamily.sans],
        body: ['Inter', ...fontFamily.sans]
      }
    },
  },
  plugins: [],
}