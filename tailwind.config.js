/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f0f4ff',
          100: '#e0e7ff', 
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        ufo: {
          glow: '#00ffff',
          beam: '#ff00ff',
          energy: '#ffff00',
          dark: '#0a0a0a',
          space: '#1a1a2e'
        }
      },
      fontFamily: {
        'cosmic': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'ufo-hover': 'ufoHover 3s ease-in-out infinite',
        'beam-down': 'beamDown 2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        ufoHover: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' }
        },
        beamDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(0px)', opacity: '1' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #00ffff' },
          '50%': { boxShadow: '0 0 40px #00ffff, 0 0 60px #ff00ff' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'space-gradient': 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        'ufo-beam': 'linear-gradient(180deg, transparent 0%, #00ffff33 50%, #ff00ff66 100%)'
      }
    },
  },
  plugins: [],
};