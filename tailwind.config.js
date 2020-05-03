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
    colors: {
      navy: '#08285A',
      yellow: '#FFD44D',
      blue: '#164DB0',
      gray: '#E1E5EB',
      white: colors.white,
      red: colors.red,
      black: colors.black,
    },
  },
  variants: {},
  plugins: [],
};
