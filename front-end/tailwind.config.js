/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*/*.{js,jsx,ts,tsx}',
    './src/**/*.html',
    './index.html'
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-bottom': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-bottom': 'fade-in-bottom 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

