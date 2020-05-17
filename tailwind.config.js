/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  important: true,
  theme: {
    fontFamily: {
      sans: ['BentonSans', 'arial'],
      condensed: ['BentonSansCondensed', 'BentonSans', 'arial'],
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    colors: {
      black: colors.black,
      blue: '#005DC7',
      'dark-gray': '#4A4A4A',
      'dark-navy': '#000F41',
      'dark-red': '#820000',
      gray: '#E1E3E6',
      navy: '#08285A',
      red: '#9B1519',
      yellow: '#FFD44D',
      white: colors.white,
    },
  },
  variants: {},
  plugins: [],
};
