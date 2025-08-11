/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'neon-green': '#00ff41',
        'neon-orange': '#ff9500',
        'neon-purple': '#8a2be2',
        'neon-yellow': '#ffff00',
        'neon-red': '#ff0040',
        'neon-blue': '#0080ff',
        'neon-pink': '#ff1493',
        'neon-lime': '#32ff32',
      },
      fontFamily: {
        'gaming': ['Orbitron', 'Space Grotesk', 'monospace'],
        'cyberpunk': ['Audiowide', 'Orbitron', 'monospace'],
        'heading': ['Orbitron', 'Space Grotesk', 'monospace'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s infinite linear alternate-reverse',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor, 0 0 20px currentColor' 
          },
          '50%': { 
            textShadow: '0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor' 
          }
        },
        glitch: {
          '0%': { transform: 'translate(0)', filter: 'drop-shadow(2px 0 0 #ff00ff) drop-shadow(-2px 0 0 #00ffff)' },
          '10%': { transform: 'translate(-2px, 1px)' },
          '20%': { transform: 'translate(2px, -1px)' },
          '30%': { transform: 'translate(-1px, 2px)' },
          '40%': { transform: 'translate(1px, -2px)' },
          '50%': { transform: 'translate(-2px, -1px)' },
          '60%': { transform: 'translate(2px, 1px)' },
          '70%': { transform: 'translate(-1px, -2px)' },
          '80%': { transform: 'translate(1px, 2px)' },
          '90%': { transform: 'translate(-2px, 1px)' },
          '100%': { transform: 'translate(0)', filter: 'drop-shadow(2px 0 0 #ff00ff) drop-shadow(-2px 0 0 #00ffff)' }
        }
      },
      backdropBlur: {
        'gaming': '4px',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.4)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.4)',
        'neon-green': '0 0 20px rgba(0, 255, 65, 0.4)',
        'neon-orange': '0 0 20px rgba(255, 149, 0, 0.4)',
        'neon-purple': '0 0 20px rgba(138, 43, 226, 0.4)',
        'gaming': '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
