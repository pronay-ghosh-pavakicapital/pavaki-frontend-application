import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#3568EC',
        'primary-light': '#D7E1FB',
        'primary-lighter': '#EBF1FF',
        'primary-blue-lightest': '#E4ECFF',
        'primary-lightest': '#E0E5EF',
        'gray-dark': '#44475B',
        'gray-light': '#CCCCCC',
        'bg-secondary': '#404040',
        'bg-tertiary': '#2C2C2C',
        'bg-tertiary-light': '#EFEFEF',
        'gray-lighter': '#B3B3B3',
        success: '#1F933C',
        error: '#F51111',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif']
      }
    }
  },
} satisfies Config