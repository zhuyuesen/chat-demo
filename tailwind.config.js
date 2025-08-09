/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 1.5s infinite',
      },
      colors: {
        'chat-blue': '#3B82F6',
        'chat-purple': '#8B5CF6',
      }
    },
  },
  plugins: [],
}