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
        primary: '#6C5CE7',
        accent: '#00D4FF'
      },
      boxShadow: {
        'neon-sm': '0 4px 20px rgba(108,92,231,0.12), 0 0 40px rgba(108,92,231,0.08)'
      },
      backgroundImage: {
        'frost': 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
