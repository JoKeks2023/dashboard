import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          'bg-2': '#0f0f1a',
          'bg-3': '#141428',
          cyan: '#00ffff',
          magenta: '#ff00ff',
          green: '#00ff41',
          yellow: '#ffff00',
          red: '#ff0040',
          purple: '#7700ff',
          silver: '#c0c0c0',
          dim: '#404060',
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'neon-cyan': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff',
        'neon-magenta': '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff',
        'neon-green': '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 20px #00ff41',
        'neon-red': '0 0 5px #ff0040, 0 0 10px #ff0040',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 3s infinite',
        'blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 2s infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, 1px)' },
          '20%': { transform: 'translate(2px, -1px)' },
          '30%': { transform: 'translate(0)' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
    }
  },
  plugins: []
} satisfies Config;
