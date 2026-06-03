export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary olive palette (replaces venus/violet)
        venus: {
          50:  '#F5F0E4',
          100: '#EBE8CF',
          200: '#D4D9A3',
          300: '#BAC876',
          400: '#9BAD55',
          500: '#7A8E3B',
          600: '#5F6F2E',
          700: '#4E5C25',
          800: '#3D4A1B',
          900: '#2C3712',
          950: '#1C240B',
        },
        // Warm beige accent (replaces pink/gold secondary)
        gold: {
          300: '#DDCA8F',
          400: '#C9AF6B',
          500: '#B5944A',
          600: '#9A7B36',
        },
        // Dark earthy admin backgrounds (replaces night/indigo)
        night: {
          50:  '#EDECD8',
          100: '#DBD9B0',
          200: '#B7B465',
          300: '#8D8A3A',
          400: '#646118',
          500: '#464400',
          600: '#353300',
          700: '#252400',
          800: '#151500',
          900: '#0A0900',
        },
      },
      boxShadow: {
        'venus':    '0 4px 20px rgba(95, 111, 46, 0.25)',
        'venus-lg': '0 8px 40px rgba(95, 111, 46, 0.35)',
        'venus-xl': '0 20px 60px rgba(95, 111, 46, 0.45)',
        'gold':     '0 4px 20px rgba(181, 148, 74, 0.30)',
        'glow':     '0 0 20px rgba(95, 111, 46, 0.55)',
      },
      backgroundImage: {
        'venus-gradient': 'linear-gradient(135deg, #5F6F2E 0%, #3D4A1B 100%)',
        'venus-pink':     'linear-gradient(135deg, #7A8E3B 0%, #B5944A 100%)',
        'hero-dark':      'linear-gradient(135deg, #151508 0%, #1C1F0A 55%, #2C3010 100%)',
        'card-shine':     'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)',
      },
      animation: {
        'float':        'float 4s ease-in-out infinite',
        'fadeIn':       'fadeIn 0.5s ease-out',
        'slideUp':      'slideUp 0.4s ease-out',
        'pulse-venus':  'pulseVenus 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)'   },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        pulseVenus: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(95,111,46,0.4)' },
          '50%':      { boxShadow: '0 0 28px rgba(95,111,46,0.8)' },
        },
      },
      borderRadius: { '2.5xl': '20px' },
    },
  },
}
