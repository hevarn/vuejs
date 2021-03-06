import { meta, link } from './manifest.js'
import getRoutes from './utils/getRoutes'
const BASE_URL = process.env.FAKEROOTKEY ? '/api' : 'http://localhost:3030/api'
console.log('Pointing front to', BASE_URL)
const buildModules = [
  '@nuxtjs/vuetify'
]
const modules = [
  '@nuxtjs/pwa',
  'nuxt-client-init-module',
  '@nuxtjs/style-resources',
  '@nuxtjs/sitemap'
]
if (process.env.GOOGLE_ANALYTICS_ID) {
  buildModules.push('@nuxtjs/google-analytics')
  console.log('adding GA for prod')
}
if (process.env.MYSQL_HOST && process.env.MYSQL_DATABASE && process.env.MYSQL_PASSWORD && process.env.MYSQL_USERNAME) {
  console.log('set connection for database')
}
if (process.env.MAIL_NAME && process.env.MAIL_SENDER && process.env.MAIL_URL_REDIRECTION && process.env.MAILER_API_KEY) {
  console.log('set connection for mail service')
}
if (process.env.STRIPE_PRIV_KEY && process.env.STRIPE_PUB_KEY && process.env.TVA_20_KEY && process.env.TVA_55_KEY) {
  console.log('stripe config are set')
}
// process.env.FB_PIXEL = 179019427099323
if (process.env.FB_PIXEL) {
  modules.push(['nuxt-facebook-pixel-module', {
    /* module options */
    track: 'PageView',
    pixelId: process.env.FB_PIXEL,
    autoPageView: false,
    disabled: false,
    debug: true
  }])
  console.log('adding fb pixel')
}

const metaTags = [
  { charset: 'utf-8' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
  { name: 'google-site-verification', content: 'DJocjix2arX2i44RfDMGgg_CBd1vmk04ZDYa9Ac8nKY' },
  { name: 'google', content: 'notranslate' },
  // googleAuth meta
  { name: 'google-signin-client_id', content: '1037989579637-il1ri6cdb7vdelpnv3te9o2ml4fed66g.apps.googleusercontent.com ' }
]

if (process.env.FB_DOMAIN_VERIF) {
  metaTags.push({
    name: 'facebook-domain-verification', content: process.env.FB_DOMAIN_VERIF
  })
}
export default {
  target: 'static',
  ssr: false,
  components: [
    { path: '~/components/', prefix: '' },
    // admin's components
    { path: '~/components/admin', prefix: 'Adm' },
    { path: '~/components/admin/kulteurs', prefix: 'AdmKult' },
    { path: '~/components/admin/market', prefix: 'AdmMark' },
    { path: '~/components/admin/orders', prefix: 'AdmOrdr' },
    { path: '~/components/admin/planning', prefix: 'AdmPlang' },
    { path: '~/components/admin/products', prefix: 'AdmPdct' },
    { path: '~/components/admin/providers', prefix: 'AdmPvdr' },
    { path: '~/components/admin/setting', prefix: 'AdmSetg' },
    { path: '~/components/admin/utils', prefix: 'AdmUtls' },
    // user's components
    { path: '~/components/user', prefix: 'User' },
    // visitors components
    { path: '~/components/visitor', prefix: 'Visit' },
    { path: '~/components/visitor/card', prefix: 'VisitCard' },
    { path: '~/components/visitor/carto', prefix: 'VisitCarto' },
    { path: '~/components/visitor/market', prefix: 'VisitMark' },
    { path: '~/components/visitor/navbar', prefix: 'VisitNav' }, /// ???
    { path: '~/components/visitor/partenaire', prefix: 'VisitPart' }
  ],
  /**
   * sitemap
   */
  sitemap: {
    hostname: process.env.NODE_ENV,
    gzip: true,
    generate: false, // G??n??re une version statique du sitemap quand activ??. ?? utiliser avec nuxt generate.
    routes () {
      return getRoutes()
    }
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'KanopeeKoncept Fruits et L??gumes',
    htmlAttrs: {
      lang: 'fr',
      amp: true
    },
    meta: metaTags,
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
      { rel: 'canonical', href: 'https://www.kanopeekoncept/dossiers/techniques/url-canonique' }
    ],
    script: [
      { src: 'https://apis.google.com/js/platform.js', async: true },
      { src: 'https://js.stripe.com/v3/', async: true }
    ]
  },
  env: {
    BASE_URL,
    stripePublicKey: process.env.STRIPE_PUB_KEY,
    MINIMUM_AMOUNT: process.env.MINIMUM_AMOUNT || 10,
    DEFAULT_PASSWORD: 'passwordToChange01!'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#AECD6B' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/fonts/AvenirNext.css',
    '~/assets/css/styles.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  /*
  ** Nuxt.js dev-modules
  */
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID // Use as fallback if no runtime config is provided
  },
  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    }
  },
  buildModules,
  styleResources: {
    scss: '~/assets/variables.scss'
  },
  /*
  ** Nuxt.js modules
  */
  modules,
  plugins: [
    { src: '~/plugins/pixel.js', ssr: false, mode: 'client' }
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    optionsPath: './vuetify.options.js',
    defaultAssets: false
  },
  /*
  ** PWA manifest configuration
  */
  pwa: {
    manifest: {
      name: 'Kanop??e Koncept',
      short_name: 'Kanop??e',
      start_url: '/',
      icons: [
        {
          src: '/icon/manifest-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: '/icon/manifest-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ],
      theme_color: '#AECD6B',
      background_color: '#AECD6B',
      display: 'standalone',
      orientation: 'portrait',
      description: 'kanopeekoncept cultive des fruits et des legumes en circuit court o?? biologique sur bordeaux'
    },
    meta,
    link,
    workbox: {
      enabled: false
      /* workbox options */
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: ['feathers-vuex'],
    extend (config, { isClient }) {
      if (isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(vue|js)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
            fix: true
          }
        })
      }
    }
  }
}
