import { formatDate, time } from '@/utils/date'
export default class Order {
  constructor (order) {
    this.order = order
    this.productsKulteur = []
    this.productsProvider = []
  }

  get id () {
    return this.order.id
  }

  get dateOrder () {
    return formatDate(this.order.createdAt)
  }

  get dateHour () {
    return time(this.order.createdAt)
  }

  get qty () {
    return this.order.qty
  }

  set qty (qty) {
    this.order.qty = qty
  }

  get priceTotalTTC () {
    return Number(this.order.priceTotalTTC)
  }

  set priceTotalTTC (price) {
    this.order.priceTotalTTC = Number(price)
  }

  get paidId () {
    return this.order.paidId
  }

  get coupon () {
    return this.order.coupon
  }

  get orderId () {
    return String(this.order.orderId)
  }

  set orderId (orderId) {
    this.order.orderId = orderId
  }

  get userId () {
    return this.order.userUserId
  }

  get user () {
    return `${this.order.user.firstname} ${this.order.user.lastname}`
  }

  get mailUser () {
    return this.order.user.email
  }

  get providerUser () {
    return this.order.user.pdt_provider.name
  }

  get adressProviderUser () {
    return this.order.user.pdt_provider.adress
  }

  get providerUserOpenDate () {
    return formatDate(this.order.user.pdt_provider.receptionOpen)
  }

  get providerUserOpenHour () {
    return time(this.order.user.pdt_provider.receptionOpen)
  }

  get providerUserClose () {
    return formatDate(this.order.user.pdt_provider.receptionClose)
  }

  get providerUserCloseHour () {
    return time(this.order.user.pdt_provider.receptionClose)
  }

  get allProducts () {
    return this.productsKulteur.concat(this.productsProvider)
  }

  addProduct (product, sellPrice) {
    product.qty = this.qty
    product.sellPrice = sellPrice
    if (product.pdtDistanceId === 1) {
      this.productsKulteur.push(product)
    } else {
      this.productsProvider.push(product)
    }
  }
}
