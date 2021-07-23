import { orderInfoService } from '@/api'

export const state = () => ({
  ordersKulteur: [],
  ordersProviders: [],
  ordersToGenerate: [],
  providerProductSummary: [],
  orderNum: 0
})

export const actions = {
  async generateOrders ({ commit, rootState }, date) {
    const { ordersKulteur, ordersProviders, providerProductSummary } = await orderInfoService.create(
      date,
      {
        query: {
          marketId: rootState.admin.selectedMarket.id
        }
      }
    )
    commit('setGeneratedOrders', { ordersKulteur, ordersProviders, providerProductSummary })
  }
}

export const mutations = {
  setGeneratedOrders (state, { ordersKulteur, ordersProviders, providerProductSummary }) {
    state.ordersKulteur = ordersKulteur
    state.ordersProviders = ordersProviders
    state.providerProductSummary = providerProductSummary
  },
  changeProvider (state, { id, reference, qty, unity, price, colis }) {
    const index = state.ordersToGenerate.findIndex(item => item.id === id)
    const orderLine = { id, reference, qty, unity, price, colis }
    if (index < 0 && qty > 0) {
      state.ordersToGenerate.push(orderLine)
    } else if (index >= 0 && qty > 0) {
      state.ordersToGenerate.splice(index, 1, orderLine)
    } else if (index >= 0 && qty <= 0) {
      state.ordersToGenerate.splice(index, 1)
    }
  },
  newOrderNum (state, lastOrder) {
    state.orderNum = Number(lastOrder) + 1
  }
}
