import { paymentService, cartService, paymentMethodsService } from '@/api'
import { loadStripe } from '@stripe/stripe-js'
import DisplayedProduct from '@/components/DisplayedProduct'

let stripe = null

async function start () {
  stripe = await loadStripe(process.env.stripePublicKey)
}

start()
export const state = () => ({
  cart: [],
  totalPrice: 0,
  coupon: null,
  changeProduct: false,
  unavailableProduct: [],
  currentOrderAmount: 0
})

export const mutations = {
  newCart (state, cart) {
    state.cart = cart
  },

  emptyCart (state) {
    state.cart = []
  },

  addItem (state, item) {
    state.cart.push(item)
  },

  incrementQty (state, { id, quantity }) {
    const product = state.cart.find(itemExist => itemExist.id === id)
    product.qty = quantity
  },

  removeItem (state, { index }) {
    state.cart.splice(index, 1)
  },

  addCoupon (state, couponInfos) {
    state.coupon = couponInfos
  },

  removeCoupon (state) {
    state.coupon = null
  },

  showChangeProduct (state, action) {
    state.changeProduct = action
  },

  changeProduct (state, product) {
    state.unavailableProduct.push(product)
  },

  emptyUnavailableProduct (state) {
    state.unavailableProduct = []
  },

  addCurrentOrderAmount (state, total) {
    state.currentOrderAmount = Number(total)
  }
}

export const actions = {
  async fetchCart ({ commit, rootState }) {
    const data = await cartService.find({
      query: { userUserId: rootState.auth.user.userId }
    })
    commit('newCart',
    // eslint-disable-next-line
    data.reduce((acc, { pdt_product, quantity, id }) => {
        try {
        // eslint-disable-next-line
          if (!pdt_product) {
            cartService.remove(id)
            return acc
          }
          const product = new DisplayedProduct(pdt_product, quantity)
          if ((!product.display || !product.isBio) && (product.stock <= 0 || !product.display || !product.stock)) {
            commit('changeProduct', product)
            commit('showChangeProduct', true)
            cartService.remove(id)
          } else {
            product.idCart = id
            acc.push(product)
          }
          return acc
        } catch (e) {
          return acc
        }
      }, [])
    )
    if (data.discount) {
      commit('addCoupon', data.discount.coupon)
    }
  },
  async setupPayment () {
    const { id } = await paymentMethodsService.create(
      {
        domainURL: window.location.origin
      },
      { query: { mode: 'setup' } }
    )
    await stripe.redirectToCheckout({
      sessionId: id
    })
  },
  async checkout (
    { rootState },
    { eventId, eventStartAt, eventEndAt, workshopId }
  ) {
    if (this.$fb) {
      this.$fb.track('InitiateCheckout')
    }
    const { url, intent, secret, isPaid } = await paymentService.create({
      pdtProviderId: rootState.auth.user.pdtProviderId,
      pdtSiteGroupingId: rootState.auth.user.pdt_provider.pdtSiteGroupingId,
      eventId,
      eventStartAt,
      eventEndAt,
      workshopId
    })
    return { stripe, url, intent, secret, isPaid }
  },
  async removeProduct ({ commit, state }, item) {
    await cartService.remove(item.idCart)
    const index = state.cart.findIndex(product => product.id === item.id)
    commit('removeItem', { index })
  },
  async removeAllProduct ({ rootState }) {
    await cartService.remove(null, {
      query: {
        userUserId: rootState.auth.user.userId
      }
    })
  },
  async addProduct ({ commit, state, rootState }, { product, quantityToAdd }) {
    const item = state.cart.find(item => item.id === product.id)
    if (item) {
      // if product exist, update it
      const { qty, idCart, id } = item
      product.idCart = idCart
      const quantity = qty + quantityToAdd
      if (quantity > 0 && quantity < 1000) {
        try {
          await cartService.patch(idCart, { quantity })
          commit('incrementQty', { id, quantity })
        } catch (e) {
          window.document.location.reload()
        }
      }
    } else {
      // create it
      product.qty = quantityToAdd
      const { id } = await cartService.create({
        pdtProductId: product.id,
        userUserId: rootState.auth.user.userId,
        quantity: product.qty <= 0 ? 1 : product.qty
      })
      product.idCart = id
      commit('addItem', product)
    }
    if (this.$fb) {
      this.$fb.track('AddToCart')
    }
  }
}

export const getters = {
  totalPrice: state => {
    let totalPrice = 0
    state.cart.forEach(element => {
      totalPrice += Number(element.priceTotalTTC)
    })
    state.priceBeforeCoupon = totalPrice
    if (state.coupon && state.coupon.amount_off) {
      totalPrice -= state.coupon.amount_off * 0.01
    }
    if (state.coupon && state.coupon.percent_off) {
      totalPrice = totalPrice - totalPrice * (state.coupon.percent_off / 100)
    }
    return totalPrice
  },
  isPaiementAvailable: (state, getters, rootState) => {
    return (
      getters.totalPrice + state.currentOrderAmount >
        rootState.auth.user.minAmountMarket &&
      rootState.auth.user.siteGrouping.isOpen &&
      state.cart.length > 0
    )
  },
  priceBeforeCoupon: (state, getters) => {
    if (state.coupon) {
      if (state.coupon.amount_off) {
        return getters.totalPrice + state.coupon.amount_off / 100
      } else {
        return (
          getters.totalPrice +
          getters.totalPrice * (state.coupon.percent_off / 100)
        )
      }
    }
    return 0
  }
}
