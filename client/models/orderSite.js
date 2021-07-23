import { formatDate, time } from '@/utils/date'

export default class OrderSite {
  constructor (order, product) {
    this.order = order
    this.product = product
    this.provider = product.pdt_references[0].pdt_provider
    this.orders = [order]
  }

  get idSite () {
    return this.provider.id
  }

  get nameSite () {
    return this.provider.name
  }

  get adressSite () {
    return this.provider.adress
  }

  get dateReceptionOpen () {
    return formatDate(this.provider.receptionOpen)
  }

  get timeReceptionOpen () {
    return time(this.provider.receptionOpen)
  }

  get dateReceptionClose () {
    return formatDate(this.provider.receptionClose)
  }

  get timeReceptionClose () {
    return time(this.provider.receptionClose)
  }

  get idProduct () {
    return this.product.id
  }

  get nameProduct () {
    return `${this.product.pdt_variety.pdt_kind.name} ${this.product.pdt_variety.name}`
  }

  get idReference () {
    return this.product.pdt_references[0].id
  }

  get reference () {
    return this.product.pdt_references[0].providerReference
  }

  get package () {
    return this.product.pdt_references[0].package
  }

  get unity () {
    return this.product.buyUnity.name
  }

  get buyPrice () {
    return this.product.pdt_references[0].pdt_buyHistories[0].buyPrice1
  }

  get totalQty () {
    return this.orders.reduce(function (acc, { qty }) {
      acc += qty
      return acc
    }, 0)
  }

  addOrder (order) {
    this.orders.push(order)
  }
}
