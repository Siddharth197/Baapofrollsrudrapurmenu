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
          red: '#dc2626',
          yellow: '#facc15',
          black: '#171717',
          light: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
