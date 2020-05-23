export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  loading: { color: '#fff' },
  css: ['~/assets/css/fonts.css'],
  plugins: [],
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/google-analytics', { id: process.env.GA_ID || 'UA-165398200-1' }],
    ['@nuxtjs/gtm', { id: process.env.GTM_ID || 'GTM-NG5QB9L' }],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    ['nuxt-mq', { breakpoints: { sm: 768, tablet: 1024, desktop: Infinity } }],
    'portal-vue/nuxt',
  ],
  build: {
    transpile: ['vue-clamp', 'resize-detector'],
    extend: (config) => {
      const svgRule = config.module.rules.find((rule) =>
        rule.test.test('.svg')
      );

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        use: ['babel-loader', 'vue-svg-loader'],
      });
    },
  },
  env: {
    SHEETS_URL: process.env.SHEETS_URL || '',
    SHOW_HEADER: process.env.SHOW_HEADER === 'true',
  },
};
