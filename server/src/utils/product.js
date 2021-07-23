export default class DisplayedProduct {
  constructor (product, qty = 0) {
    this.product = product
    // TODO pass all in getters
    this.qty = qty
  }

  get id () {
    return this.product.id
  }

  get description () {
    return this.product.description
  }

  get disassemble () {
    return this.product.disassemble
  }

  get sellUnity () {
    let unity = null
    if (this.product.sellUnity) {
      unity = this.product.sellUnity.name
    }
    return unity
  }

  get sharedReference () {
    return this.product.sharedReference
  }

  get spotlight () {
    return this.product.spotlight
  }

  get display () {
    return this.product.display
  }

  get favouriteRefId () {
    return this.product.favouriteRefId
  }

  get favouriteRefName () {
    return this.product.pdt_references.find(ref => ref.id === this.product.favouriteRefId).kanopeeReference
  }

  get category () {
    return this.product.pdt_category.name
  }

  get country () {
    return this.product.pdt_country.name
  }

  get unity () {
    return this.product.buyUnity.name
  }

  get distance () {
    return this.product.pdt_distance.name
  }

  get variety () {
    return this.product.pdt_variety.name
  }

  get kind () {
    return this.product.pdt_variety.pdt_kind.name
  }

  get type () {
    return this.product.pdt_variety.pdt_kind.pdt_type.name
  }

  get picture () {
    return this.product.pdt_variety.picture
  }

  get priceTotalTTC () {
    return (this.lastSellPrice * this.qty).toFixed(2)
  }

  get isFavorit () {
    if (this.product.favoritProducts && this.product.favoritProducts.length) {
      return this.product.favoritProducts[0].id
    }
  }

  setFavorit (value) {
    this.product.favoritProducts = value
  }

  get stock () {
    // new value
    return this.product.pdt_references.reduce((a, b) => {
      const stock = this.product.pdtDistanceId > 1 ? b.providerStockValue : b.kultorStockValue
      return a + parseFloat(stock)
    }, 0) || 0
  }

  get preparationAdvice () {
    return this.product.pdt_variety.preparationAdvice
  }

  get varietyDescription () {
    return this.product.pdt_variety.description
  }

  get productIds () {
    // eslint-disable-next-line camelcase
    const { pdtCategoryId, pdtCountryId, pdtWeightUnityId, pdtVarietyId, pdtDistanceId, pdt_variety, favouriteRefId, sellUnityId } = this.product
    return {
      category: pdtCategoryId,
      country: pdtCountryId,
      unity: pdtWeightUnityId,
      variety: pdtVarietyId,
      distance: pdtDistanceId,
      kind: pdt_variety.pdtKindId,
      type: pdt_variety.pdt_kind.pdtTypeId,
      favouriteRef: favouriteRefId,
      sellUnity: sellUnityId || null
    }
  }

  get isArchived () {
    return this.product.isArchived
  }

  get isBio () {
    return this.product.pdtDistanceId !== 1
  }

  get productName () {
    return `${this.kind} ${this.variety}`
  }

  get lastSellPrice () {
    if (this.product.pdt_sellHistories && Array.isArray(this.product.pdt_sellHistories) && this.product.pdt_sellHistories.length) {
      const result = this.product.pdt_sellHistories.slice(0).sort((a, b) => { return b.id - a.id })
      return Number(result[0].sellPrice).toFixed(2)
    } else {
      return null
    }
  }

  get ratioPrice () {
    if (this.product.pdt_sellHistories && Array.isArray(this.product.pdt_sellHistories) && this.product.pdt_sellHistories.length) {
      const result = this.product.pdt_sellHistories.slice(0).sort((a, b) => { return b.id - a.id })
      return result[0].ratio
    } else {
      return null
    }
  }

  getRatioRefPrice (providerId) {
    if (providerId && this.product.pdt_sellHistories && Array.isArray(this.product.pdt_sellHistories) && this.product.pdt_sellHistories.length && this.product.pdt_references && this.product.pdt_references.find(x => x.pdtProviderId === providerId).pdt_buyHistories.slice(0).sort((a, b) => { return b.id - a.id })[0]) {
      const sellPrice = this.product.pdt_sellHistories.slice(0).sort((a, b) => { return b.id - a.id })[0].sellPrice
      const buyPrice = this.product.pdt_references.find(x => x.pdtProviderId === providerId).pdt_buyHistories.slice(0).sort((a, b) => { return b.id - a.id })[0].buyPrice1
      return ((sellPrice - buyPrice * ((0 + (this.product.disassemble / 100)) || 1)) / sellPrice * 100).toFixed(2)
    } else {
      return null
    }
  }

  get historySellPrice () {
    return this.product.pdt_sellHistories.slice(0).sort((a, b) => { return b.id - a.id })
  }

  get referencesPdt () {
    return this.product.pdt_references
  }

  getRefProviders (pvd, isAdmin) {
    let group = false
    pvd.map(x => x.id).forEach((element) => {
      if (this.product.pdt_references && this.product.pdt_references.map(x => x.pdtProviderId).includes(element)) {
        group = true
      }
      if (!this.product.pdt_references.length && isAdmin) {
        group = true
      }
    })
    return group
  }

  getNewSharedRef (prod) {
    const newRef = prod.sharedReference.split('_')
    newRef[2] = prod.pdtCategoryId
    newRef[3] = prod.pdtWeightUnityId
    newRef[4] = prod.pdtDistanceId
    newRef[5] = prod.pdtSiteGroupingId
    newRef[6] = this.product.country ? this.product.country.substring(0, 3) : this.country.substring(0, 3)
    return newRef.join('_')
  }

  setSharedRef (e, kind) {
    return `${kind.substring(0, 4)}_${e.name.substring(0, 10)}_0_0_0_FR`
  }

  setCountry (e) {
    this.product.country = e
  }

  setClear () {
    this.product = {}
  }

  getProductByGroup () {
    return this.product
  }

  get provider () {
    return this.product.pdt_references[0].pdt_provider.name
  }

  get providerId () {
    return this.product.pdt_references[0].pdtProviderId
  }

  get buyHistory () {
    return this.product.pdt_references
  }
}
