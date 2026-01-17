/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue 500
        'primary-dark': '#2563EB', // Blue 600
        dark: '#374151', // Gray 700
      },
      fontFamily: {
        serif: ['Times New Roman', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}