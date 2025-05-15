import { defineConfig } from 'tailwindcss'

export default defineConfig({
  darkMode: 'media',        
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'glass-bg': 'var(--glass-bg)',
        'glass': 'var(--glass-color)',
      }
    },
  },
  plugins: [],
})