/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './screens/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      // Preserve any custom theme extensions from the original app
      colors: {
        gray: {
          100: '#f3f4f6',
          800: '#1f2937',
        }
      },
    },
  },
  plugins: [],
}