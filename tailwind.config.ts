import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Editorial/magazine fontları
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '700',
              fontSize: '2.5rem',
              lineHeight: '1.2',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '600',
              fontSize: '2rem',
              lineHeight: '1.3',
            },
            h3: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontWeight: '500',
              fontSize: '1.5rem',
              lineHeight: '1.4',
            },
            p: {
              fontSize: '1.125rem',
              lineHeight: '1.7',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      colors: {
        // Editorial color palette
        'editorial': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
