/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B1F3A',
          gold: '#D4AF37',
          light: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}
