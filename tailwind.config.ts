import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7b68ee',
        'primary-dark': '#5b50c4',
        secondary: '#6366f1',
        'secondary-dark': '#4f46e5',
        muted: '#9ca3af',
      },
      boxShadow: {
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        navbar: '128px',
      },
      /** 👇 NUEVO: Animación texto glow */
      animation: {
        'text-glow': 'textGlow 6s ease-in-out infinite',
      },
      keyframes: {
        textGlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
