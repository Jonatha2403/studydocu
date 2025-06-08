import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import aspectRatio from '@tailwindcss/aspect-ratio'
import scrollbar from 'tailwind-scrollbar'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      screens: {
        xs: '475px',
      },
      fontFamily: {
        sans: [
          'var(--font-sf)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        primary: {
          light: '#A78BFA',
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
          foreground: colors.white,
        },
        secondary: {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
          foreground: colors.white,
        },
        success: {
          DEFAULT: colors.green[600],
          foreground: colors.white,
        },
        error: {
          DEFAULT: colors.red[600],
          foreground: colors.white,
        },
        warning: {
          DEFAULT: colors.amber[500],
          foreground: colors.black,
        },
        appBackground: colors.slate[50],
        appBackgroundDark: '#0B1120',
        appForeground: colors.slate[800],
        appForegroundDark: colors.slate[100],
        card: {
          light: colors.white,
          dark: colors.slate[800],
        },
        cardForeground: {
          light: colors.slate[800],
          dark: colors.slate[100],
        },
        borderCustom: {
          light: colors.slate[200],
          dark: colors.slate[700],
        },
        muted: {
          DEFAULT: colors.slate[500],
          foreground: colors.slate[400],
        },
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        DEFAULT:
          '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        interactive: '0 0 0 3px rgba(124, 58, 237, 0.4)',
        'card-hover': '0 10px 20px -5px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [forms, typography, aspectRatio, scrollbar],
}

export default config
