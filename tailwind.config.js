/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0B0D',
        charcoal: '#141419',
        charcoal2: '#1B1B22',
        gold: '#C8A35B',
        goldsoft: '#E4C98A',
        bone: '#EDE7DC',
        taupe: '#9A9285',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
        wide2: '0.32em',
      },
    },
  },
  plugins: [],
}
