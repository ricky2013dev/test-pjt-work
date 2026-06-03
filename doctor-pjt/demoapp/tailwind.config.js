/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0f2d55',
        navyMid: '#1a4a80',
        teal: { DEFAULT: '#0f766e', light: '#f0fdf4', mid: '#d1fae5' },
        sky: { DEFAULT: '#0ea5e9', light: '#f0f9ff', mid: '#bae6fd' },
        border: '#e8edf2',
        bg: '#f0f4f8',
        text1: '#1e293b',
        text2: '#475569',
        text3: '#94a3b8',
      },
    },
  },
  plugins: [],
}
