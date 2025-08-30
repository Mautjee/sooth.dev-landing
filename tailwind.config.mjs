/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gruvbox: {
          dark: {
            bg: '#282828',
            bg0: '#32302f',
            bg1: '#3c3836',
            bg2: '#504945',
            bg3: '#665c54',
            bg4: '#7c6f64',
            fg: '#ebdbb2',
            fg0: '#fbf1c7',
            fg1: '#ebdbb2',
            fg2: '#d5c4a1',
            fg3: '#bdae93',
            fg4: '#a89984',
          },
          light: {
            bg: '#fbf1c7',
            bg0: '#f9f5d7',
            bg1: '#ebdbb2',
            bg2: '#d5c4a1',
            bg3: '#bdae93',
            bg4: '#a89984',
            fg: '#3c3836',
            fg0: '#282828',
            fg1: '#3c3836',
            fg2: '#504945',
            fg3: '#665c54',
            fg4: '#7c6f64',
          },
          red: '#fb4934',
          green: '#b8bb26',
          yellow: '#fabd2f',
          blue: '#83a598',
          purple: '#d3869b',
          aqua: '#8ec07c',
          orange: '#fe8019',
          gray: '#928374',
          'bright-red': '#fb4934',
          'bright-green': '#b8bb26',
          'bright-yellow': '#fabd2f',
          'bright-blue': '#83a598',
          'bright-purple': '#d3869b',
          'bright-aqua': '#8ec07c',
          'bright-orange': '#fe8019',
        }
      },
      animation: {
        'fade-in': 'fadeIn 2s ease-in-out',
        'slide-up': 'slideUp 1.5s ease-out',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            textShadow: '0 0 5px currentColor',
            transform: 'scale(1)',
          },
          '50%': { 
            textShadow: '0 0 20px currentColor, 0 0 30px currentColor',
            transform: 'scale(1.05)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'currentColor' },
        },
      }
    },
  },
  plugins: [],
}