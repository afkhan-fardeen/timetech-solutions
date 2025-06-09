/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          black: '#1d1d1f',
          gray: '#6e6e73',
          light: '#f5f5f7',
          blue: '#0071e3',
          blueHover: '#005bb5',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero': '3rem',
        'subhero': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'apple': '980px',
      },
      boxShadow: {
        'apple': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  plugins: [],
};