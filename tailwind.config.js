/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#064E3B',
          950: '#022C22',
        },
        emeraldTheme: {
          DEFAULT: '#059669',
          hover: '#047857',
          darkBg: '#091512',
          darkCard: '#111E1A',
          darkBorder: '#1A332B',
          lightBg: '#F8FAF9',
          lightCard: '#FFFFFF',
          lightBorder: '#E5E9E7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'dark-soft': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'emerald-glow': '0 0 25px -4px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
