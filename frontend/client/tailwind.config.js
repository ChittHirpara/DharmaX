/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dharmax: {
          bg: '#050505',
          panel: 'rgba(20, 20, 25, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          gold: '#d4af37',
          goldDim: 'rgba(212, 175, 55, 0.2)',
          text: '#e2e8f0',
          textMuted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
