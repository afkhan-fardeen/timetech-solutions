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
          black: '#1d1d1f',    // Dark gray for text
          gray: '#6e6e73',     // Muted gray for secondary text
          light: '#f5f5f7',    // Background gray
          blue: '#0071e3',     // Accent blue
          blueHover: '#005bb5', // Darker blue for hover
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
        'hero': '3rem',    // For large headings
        'subhero': '1.5rem', // For subheadings
      },
      spacing: {
        '18': '4.5rem',    // Extra padding/margin options
        '22': '5.5rem',
      },
      borderRadius: {
        'apple': '980px',  // Pill-shaped buttons
      },
      boxShadow: {
        'apple': '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.15)', // Larger shadow
      },
      transitionProperty: {
        'height': 'height', // For smooth height transitions
      },
    },
  },
  plugins: [],
};