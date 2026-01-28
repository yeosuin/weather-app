/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        'bento': '32px',
      },
      colors: {
        weather: {
          sunny: {
            bg: '#fefce8',
            text: '#854d0e',
          },
          cloudy: {
            bg: '#eff6ff',
            text: '#1e40af',
          },
          rainy: {
            bg: '#eef2ff',
            text: '#312e81',
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
