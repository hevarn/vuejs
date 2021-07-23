import { Stripe } from 'stripe'

export default class Service {
  constructor (key) {
    this.stripe = Stripe(key)
  }

  async create (products, { query, user }) {
    // if refunds is adjustments to the amount due.
    // get invoice id
    const { invoiceId } = products.pop()
    // create object to send
    const refundsList = products.map(product => ({
      type: 'invoice_line_item',
      invoice_line_item: product.id,
      quantity: product.expected - Math.floor(product.quantity)
    }))
    // get sum of credit
    const sumRefunds = products.map(product => {
      const realAmount = product.price.unit_amount
      const fullDiscount = product.discount_amounts.reduce((acc, val) => val.amount + acc, 0)
      const discountedAmount = product.quantity * fullDiscount / product.expected
      return (realAmount - discountedAmount) * (product.expected - Math.floor(product.quantity))
    })
    if (query.creditNotes) {
      await this.stripe.creditNotes.create({
        invoice: invoiceId,
        lines: refundsList,
        credit_amount: sumRefunds.reduce((a, c) => a + c),
        reason: 'order_change'
      })
      return 200
    }
  }
}
