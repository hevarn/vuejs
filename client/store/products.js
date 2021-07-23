export const state = () => ({
  oldPrice: [],
  newPrice: [],
  kanopeeSharedRef: []
})

export const mutations = {
  addProducts (state, products) {
    state.oldPrice.push(...products)
  },
  clearProducts (state) {
    state.oldPrice = []
  },
  addOldProducts (state, products) {
    state.newPrice = []
    state.newPrice.push(...products)
  },
  addKanopeeRef (state, references) {
    state.kanopeeSharedRef = references
  }
}
