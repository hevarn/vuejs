export default class OrderProvider {
  constructor (product) {
    this.product = product
  }

  get productId () {
    return this.product.pdt_product.id
  }

  get qty () {
    return this.product.qty
  }

  set qty (qty) {
    this.product.qty = qty
  }

  get priceTotalTTC () {
    return Number(this.product.priceTotalTTC)
  }

  get distance () {
    return this.product.pdt_product.pdtDistanceId
  }

  get favouriteRefId () {
    return this.product.pdt_product.favouriteRefId
  }

  get variety () {
    return this.product.pdt_product.pdt_variety.name
  }

  get kind () {
    return this.product.pdt_product.pdt_variety.pdt_kind.name
  }

  get unity () {
    return this.product.pdt_product.buyUnity.name
  }

  get references () {
    return this.product.pdt_product.pdt_references
  }

  get stock () {
    return this.product.pdt_product.actualStock
  }

  selectedReference () {
    if (this.product.pdt_product.favouriteRefId) {
      return this.references.find(
        x => x.id === this.product.pdt_product.favouriteRefId
      )
    } else {
      return {}
    }
  }
}
