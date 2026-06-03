export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        venus: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        gold: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        night: {
          50:  '#ECEAF8',
          100: '#D8D4F1',
          200: '#B1A9E3',
          300: '#8A7ED5',
          400: '#6353C7',
          500: '#2D2060',
          600: '#1A1030',
          700: '#120B22',
          800: '#0A0613',
          900: '#050309',
        },
      },
      boxShadow: {
        'venus':    '0 4px 20px rgba(124, 58, 237, 0.25)',
        'venus-lg': '0 8px 40px rgba(124, 58, 237, 0.35)',
        'venus-xl': '0 20px 60px rgba(124, 58, 237, 0.45)',
        'gold':     '0 4px 20px rgba(245, 158, 11, 0.30)',
        'glow':     '0 0 20px rgba(124, 58, 237, 0.60)',
      },
      backgroundImage: {
        'venus-gradient': 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'venus-pink':     'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'hero-dark':      'linear-gradient(135deg, #0F0A1E 0%, #1A1030 55%, #2D1B69 100%)',
        'card-shine':     'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)',
      },
      animation: {
        'float':   'float 4s ease-in-out infinite',
        'fadeIn':  'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'pulse-venus': 'pulseVenus 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseVenus: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(124,58,237,0.4)' },
          '50%':      { boxShadow: '0 0 28px rgba(124,58,237,0.8)' },
        },
      },
      borderRadius: {
        '2.5xl': '20px',
      },
    },
  },
}
