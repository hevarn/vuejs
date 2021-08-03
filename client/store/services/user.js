
import feathersClient, {
  makeServicePlugin,
  BaseModel
} from '~/plugins/feathers'

// const GoogleID = '144124169257-t7643bi0o1sbs7do8fukn1knhu2ev7j1.apps.googleusercontent.com'
// const GoogleSecret = 'VxQg67KR8hq2y05RIF11JraH'

class User extends BaseModel {
  constructor (data, options, modelName) {
    super(data, options)
  }

  get provider () {
    return this.pdt_provider
  }

  get siteGrouping () {
    return this.pdt_provider.pdt_siteGrouping
  }

  get isAdmin () {
    return this.rank === 'admin'
  }

  get siteId () {
    return this.pdtProviderId
  }

  get groupId () {
    return this.pdt_provider.pdtSiteGroupingId
  }

  get isKulteur () {
    return this.rank === 'kulteur'
  }

  get isUser () {
    return this.rank === 'user'
  }

  get redirectUser () {
    if (this.rank === 'admin') {
      return '/admin/products'
    } else if (this.rank === 'user') {
      return '/user/items'
    } else if (this.rank === 'kulteur') {
      return '/admin/kulteurs'
    }
  }

  get hasMarkets () {
    return this.pdt_provider.marketEvents.length > 0
  }

  get currentMarket () {
    if (this.pdt_provider.marketEvents.length === 0) {
      return {
        receptionOpen: new Date(),
        receptionClose: new Date(),
        market: {
          opening: new Date(),
          closing: new Date(),
          isOpen: false,
          minAmount: 20,
          id: -1
        }
      }
    }
    return this.pdt_provider.marketEvents.slice().sort((a, b) => (a.market.opening - b.market.opening)).filter((x) => new Date(x.market.closing) > new Date())[0]
  }

  get openingDelivery () {
    return new Date(this.currentMarket.receptionOpen)
  }

  get closingDelivery () {
    return new Date(this.currentMarket.receptionClose)
  }

  get closingMarket () {
    return new Date(this.currentMarket.market.closing)
  }

  get openingMarket () {
    return new Date(this.currentMarket.market.opening)
  }

  get minAmountMarket () {
    return this.currentMarket.market.minAmount
  }

  get marketId () {
    return this.currentMarket.market.id
  }

  get marketEventsId () {
    return this.currentMarket.id
  }

  get statusMarket () {
    let status = false
    const { market: { opening, closing, isOpen } } = this.currentMarket
    const now = new Date()
    if (
      now >= new Date(opening) &&
      now <= new Date(closing) &&
      isOpen
    ) {
      status = true
    }
    return status
  }

  get timeMarketClosing () {
    const { market: { closing } } = this.currentMarket
    const date = Date.parse(new Date())
    if (Date.parse(closing) > date) {
      const day = parseInt((Date.parse(closing) - date) / 86400000)
      let wordDay = 'jour'
      if (day > 1) {
        wordDay = 'jours'
      }
      if (day === 0) {
        return 'Dernier jour avant la fermeture du marché'
      }
      return `Plus que ${day} ${wordDay} avant la fermeture du marché !`
    } else {
      return 'Le marché est fermé'
    }
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'User'
  // Define default properties here
  static instanceDefaults () {
    return {
      email: '',
      password: '',
      rank: ''
    }
  }
}

const servicePath = 'users'
const servicePlugin = makeServicePlugin({
  Model: User,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})
export default servicePlugin
