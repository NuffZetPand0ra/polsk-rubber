import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1f2937',
            h1: {
              fontFamily: '"Source Serif 4", ui-serif, Georgia, serif',
              fontWeight: '700',
              letterSpacing: '-0.01em',
            },
            h2: {
              fontFamily: '"Source Serif 4", ui-serif, Georgia, serif',
              fontWeight: '700',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontFamily: '"Source Serif 4", ui-serif, Georgia, serif',
              fontWeight: '700',
            },
            p: {
              lineHeight: '1.8',
            },
            li: {
              lineHeight: '1.75',
            },
            code: {
              fontWeight: '600',
            },
          },
        },
        invert: {
          css: {
            color: '#cbd5e1',
            h1: { color: '#f8fafc' },
            h2: { color: '#f8fafc' },
            h3: { color: '#f8fafc' },
            strong: { color: '#f8fafc' },
            code: { color: '#e2e8f0' },
          },
        },
      },
    },
  },
  plugins: [typography],
}

