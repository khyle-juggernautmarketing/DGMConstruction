import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#003466',
          crimson: '#A60A0A',
          charcoal: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 4px 24px -4px rgba(0, 52, 102, 0.1)',
        'card-lg': '0 16px 48px -12px rgba(0, 52, 102, 0.18)',
        lift: '0 12px 32px -8px rgba(166, 10, 10, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config
