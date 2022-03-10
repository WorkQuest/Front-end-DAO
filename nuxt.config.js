import localeEn from './locales/en.json';

require('dotenv').config();

export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'WorkQuest',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Decentralized marketplace for work. Where employers can look for performers for different tasks, and workers perform. Work in any field with different deadlines, interactions occur through smart contracts.' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/app/favicon.svg' },
    ],
  },
  css: [
    '@/assets/scss/main.scss',
  ],
  plugins: [
    { src: '@plugins/axios.js' },
    { src: '@plugins/main.js' },
    { src: '@plugins/vee-validate.js' },
    { src: '@plugins/clipboard.js' },
    { src: '@plugins/injectComponents.js' },
    { src: '@plugins/vue-qrcode.js' },
  ],
  components: true,
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/color-mode',
    '@nuxtjs/moment',
  ],
  styleResources: {
    scss: ['./assets/scss/resources.scss'],
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'bootstrap-vue/nuxt',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    ['nuxt-gmaps', {
      key: process.env.GMAPKEY,
    }],
  ],
  build: {
    loaders: {
      scss: { sourceMap: false },
    },
    transpile: [
      'vee-validate/dist/rules',
    ],
    babel: {
      compact: false,
    },
  },
  axios: {
    baseURL: process.env.BASE_URL,
  },
  // bootstrapVue: {
  //   // bootstrapCSS: false, // Or `css: false`
  //   // bootstrapVueCSS: false, // Or `bvCSS: false`
  //   icons: true,
  // },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      messages: {
        en: localeEn,
      },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
    },
  },
  env: {
    PROD: process.env.PROD,
    BASE_URL: process.env.BASE_URL,
    GMAPKEY: process.env.GMAPKEY,

    SECRET_SUMSUB: process.env.SECRET_SUMSUB,
    WQ_TOKEN: process.env.WQ_TOKEN,
    WQ_DAO_VOTING: process.env.WQ_DAO_VOTING,
    WQ_PROVIDER: process.env.WQ_PROVIDER,
    WQ_EXPLORER: process.env.WQ_EXPLORER,
  },
};
