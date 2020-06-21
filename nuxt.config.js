const metaTitle = 'LiveGuide, presented by The Boston Globe';
const metaDescription =
  "The Boston Globe is proud to present LiveGuide, your daily schedule of the latest livestreams and other content from around the internet. Stay tuned for entertainment, news, virtual events, and the Globe's critics' picks.";

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'LiveGuide by The Boston Globe',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: metaDescription,
      },
      {
        hid: 'ogDescription',
        property: 'og:description',
        content: metaDescription,
      },
      {
        hid: 'ogTitle',
        property: 'og:title',
        content: metaTitle,
      },
      {
        hid: 'ogUrl',
        property: 'og:url',
        content: process.env.URL,
      },
      {
        hid: 'ogImage',
        property: 'og:image',
        content: `${process.env.URL}/sm_preview_facebook.png`,
      },
      {
        hid: 'twCard',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twUrl',
        property: 'twitter:url',
        content: process.env.URL,
      },
      {
        hid: 'twTitle',
        property: 'twitter:title',
        content: metaTitle,
      },
      {
        hid: 'twDescription',
        property: 'twitter:description',
        content: metaDescription,
      },
      {
        hid: 'twImage',
        property: 'twitter:image',
        content: `${process.env.URL}/sm_preview_twitter.png`,
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
    BASE_URL: process.env.BASE_URL || 'https://www.liveguide.us',
    SHEETS_URL: process.env.SHEETS_URL || '',
    VARIANT: process.env.VARIANT || '',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
  },
};
