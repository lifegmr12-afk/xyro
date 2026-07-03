/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050505',
        primary: {
          DEFAULT: '#6C5CE7',
          light: '#a29bfe',
          dark: '#5541d9'
        },
        accent: {
          DEFAULT: '#00D4FF',
          light: '#74b9ff',
          dark: '#0099cc'
        },
        success: {
          DEFAULT: '#00C853',
          light: '#69f0ae',
          dark: '#00a844'
        },
        warning: {
          DEFAULT: '#FFB300',
          light: '#ffd54f',
          dark: '#c68400'
        },
        error: {
          DEFAULT: '#FF5252',
          light: '#ff867f',
          dark: '#c50e29'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      boxShadow: {
        'neon-sm': '0 4px 20px rgba(108, 92, 231, 0.15), 0 0 40px rgba(108, 92, 231, 0.1)',
        'neon-md': '0 8px 30px rgba(108, 92, 231, 0.2), 0 0 60px rgba(108, 92, 231, 0.15)',
        'neon-lg': '0 12px 40px rgba(108, 92, 231, 0.25), 0 0 80px rgba(108, 92, 231, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'frost': 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))',
        'mesh': 'radial-gradient(ellipse at 20% 20%, rgba(108, 92, 231, 0.08), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 212, 255, 0.06), transparent 50%)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'gradient-x': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}
