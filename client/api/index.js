import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import axios from 'axios'
import auth from '@feathersjs/authentication-client'

const app = feathers()
const storage = window.localStorage
const restClient = rest(process.env.BASE_URL)
// Setup the transport (Rest, Socket, etc.) here
app.configure(restClient.axios(axios))
  .configure(auth({ storageKey: '1-m!!mùpk_sq(a_or-0O_o@fqsgrk;4u', storage, locationKey: '/' }))

// Services
const userService = app.service('users')
const productsService = app.service('products')
const providersService = app.service('providers')
const countriesService = app.service('countries')
const varietiesService = app.service('varieties')
const categoriesService = app.service('categories')
const typesService = app.service('types')
const weightUnitiesService = app.service('weight-unities')
const distancesService = app.service('distances')
const kindsService = app.service('kinds')
const cartService = app.service('cart')
const paymentService = app.service('payment')
const referencesService = app.service('references')
const buyHistoriesService = app.service('buy-history')
const couponsStripeService = app.service('couponsStripe')
const couponsService = app.service('coupons')
const sellHistoriesService = app.service('sell-history')
const siteGroupingsService = app.service('site-groupings')
const orderProvidersService = app.service('order-provider')
const stocksService = app.service('stocks')
const kulteurStocksService = app.service('kulteur-stocks')
const actionsStocksService = app.service('actions-stocks')
const authManagementService = app.service('authManagement')
const mailerService = app.service('mailer')
const checkCartService = app.service('check-cart')
const pressService = app.service('press')
const favoritProductsService = app.service('favorit-products')
const paymentMethodsService = app.service('paymentMethods')
const refundService = app.service('refund')
const settingService = app.service('setting')
const orderInfoService = app.service('orderInfo')
const eventsService = app.service('events')
const participationsService = app.service('participations')
const workshopsService = app.service('workshops')
const marketService = app.service('market')
const marketEventsService = app.service('marketEvents')

export {
  userService, paymentMethodsService, refundService,
  productsService, distancesService, kindsService,
  providersService, countriesService, varietiesService,
  categoriesService, typesService, weightUnitiesService,
  cartService, paymentService, referencesService,
  buyHistoriesService, siteGroupingsService, couponsStripeService, sellHistoriesService,
  orderProvidersService, stocksService, kulteurStocksService,
  actionsStocksService, authManagementService, mailerService,
  checkCartService, pressService, couponsService, favoritProductsService,
  settingService, orderInfoService, eventsService, participationsService, workshopsService,
  marketService, marketEventsService
}

export default app
