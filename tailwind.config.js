/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        priYellow: '#ffe247',
        priRed: '#dc2627',
        priGrey: '#4a4a4a',
        modalGrey: 'rgba(10, 10, 10, .86)'
      }
    }
  },
  plugins: []
};
