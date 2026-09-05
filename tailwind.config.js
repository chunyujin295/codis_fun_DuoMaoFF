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
        primary: {
          50: '#f4f5ea',
          100: '#e4e8d2',
          200: '#cfd7b8',
          300: '#b3c494',
          400: '#82976b',
          500: '#465b38',
          600: '#3b4c30',
          700: '#303f29',
          800: '#273323',
          900: '#1f291c',
        },
        secondary: {
          50: '#f1f3ea',
          100: '#e0e6d7',
          200: '#cad5bc',
          300: '#b2c4a3',
          400: '#8b9f79',
          500: '#697c57',
          600: '#576747',
          700: '#455336',
          800: '#35402a',
          900: '#252e1e',
        },
        accent: {
          50: '#f7f8e9',
          100: '#edf3d4',
          200: '#e0efb6',
          300: '#d6ec8e',
          400: '#cce875',
          500: '#b6d157',
          600: '#8b9e35',
          700: '#727f2c',
          800: '#586124',
          900: '#41481b',
        },
      },
      fontFamily: {
        serif: ['Arial', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        sans: ['Arial', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
