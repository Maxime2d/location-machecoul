/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f4',
          100: '#d8ebe1',
          200: '#b4d7c6',
          300: '#89bda5',
          400: '#5fa084',
          500: '#3d8066',
          600: '#2f6652',
          700: '#275243',
          800: '#224237',
          900: '#1d372e',
          950: '#0f1f1a',
        },
        cream: {
          50: '#fdfcfb',
          100: '#f9f6f2',
          200: '#f2ebe3',
          300: '#e8dccf',
          400: '#d4c4ae',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
