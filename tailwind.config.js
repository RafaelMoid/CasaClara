/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f6f7f5', 100: '#eef1ed', 200: '#e1e6e1', 300: '#cbd2cb', 400: '#9da69e',
          500: '#6f7970', 600: '#586159', 700: '#424a43', 800: '#2b312c', 900: '#191d1a', 950: '#121513'
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-secondary': 'rgb(var(--color-surface-secondary) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        content: 'rgb(var(--color-text-primary) / <alpha-value>)',
        muted: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        outline: 'rgb(var(--color-border) / <alpha-value>)',
        income: 'rgb(var(--color-income) / <alpha-value>)',
        expense: 'rgb(var(--color-expense) / <alpha-value>)',
        brand: {
          50: '#edf6f1',
          100: '#dcece4',
          500: '#4d826b',
          600: '#39715b',
          700: '#2f5e4c',
          900: '#1d3b30',
          950: '#12271f'
        },
        mint: '#58a982',
        coral: '#d97873',
        amberSoft: '#d4a555'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(32, 37, 32, 0.06)',
        card: '0 2px 12px rgba(32, 37, 32, 0.045)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      transitionDuration: { fast: '150ms', normal: '220ms', slow: '300ms' }
    },
  },
  plugins: [],
};
