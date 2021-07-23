import { Stripe } from 'stripe'

export default class Service {
  constructor (key) {
    this.stripe = Stripe(key)
  }

  setup (app) {
    this.productsService = app.service('/api/products')
  }

  // Get all invoiceITems
  async get (id) {
    const items = []
    for await (const item of this.stripe.invoices.listLineItems(id, { limit: 100 })) {
      items.push(item)
    }
    return items
  }

  // Generate orders
  async create (created, { query }) {
    const kulteurProductMap = new Map()
    const prodiverProductMap = new Map()
    const providerProductSummary = new Map()
    // T0D0 replace by stripe.invoicesItems.list
    for await (const order of this.stripe.invoices.list({
      limit: 100,
      status: 'paid',
      expand: ['data.charge'],
      created
    })) {
      // Skip delivered
      if (order.metadata.delivered === '1') {
        continue
      }
      // Skip refunded
      if (order.charge && order.charge.refunded) {
        continue
      }
      // skip credit
      if (order.post_payment_credit_notes_amount === order.total) {
        continue
      }
      // skip orders is from another market
      if (Number(order.metadata.marketId) !== Number(query.marketId)) {
        continue
      }
      if (order.lines.has_more) {
        for await (const invoiceItem of this.stripe.invoices.listLineItems(order.id,
          { limit: 100, starting_after: order.lines.data[9].id })) {
          order.lines.data.push(invoiceItem)
        }
      }
      order.lines.data.forEach((orderItem) => {
        if ((/true/i).test(orderItem.metadata.isBio)) {
          let quantity = orderItem.quantity
          if (prodiverProductMap.has(orderItem.metadata.pdtProductId)) {
            quantity += prodiverProductMap.get(orderItem.metadata.pdtProductId)
          }
          prodiverProductMap.set(orderItem.metadata.pdtProductId, quantity)
          // todo populate providerProductSummary here
          generateSummaryList(false)
        } else {
          generateSummaryList()
        }
        function generateSummaryList (kultor = true) {
          const list = kultor ? kulteurProductMap : providerProductSummary
          if (list.has(orderItem.metadata.pdtProductId)) {
            const product = list.get(orderItem.metadata.pdtProductId)
            product.quantity += orderItem.quantity
            product.orders.push({
              created: order.created,
              customer: order.customer_name,
              quantity: orderItem.quantity
            })
          } else {
            list.set(orderItem.metadata.pdtProductId, {
              siteName: order.custom_fields[0].value,
              siteAdress: order.metadata.providerAdress,
              receptionOpen: order.metadata.receptionOpen,
              receptionClose: order.metadata.receptionClose,
              pdtProviderId: order.metadata.pdtProviderId,
              reference: orderItem.metadata.providerReference ? orderItem.metadata.providerReference : orderItem.metadata.favouriteRefId, // TODO set in invoiceItem kanoperef
              quantity: orderItem.quantity,
              description: orderItem.description,
              packaging: orderItem.metadata.packaging,
              favouriteRefId: orderItem.metadata.favouriteRefId,
              amount: (orderItem.amount / 100).toFixed(2),
              orders: [{
                created: order.created,
                customer: order.customer_name,
                quantity: orderItem.quantity
              }]
            })
          }
        }
      })
    }

    const id = [...prodiverProductMap.keys()]
    const data = await this.productsService.find({ query: { id, orderInfo: true } })
    const product = data.map(x => x.toJSON())
    return {
      ordersKulteur: [...kulteurProductMap.values()],
      providerProductSummary: [...providerProductSummary.values()],
      ordersProviders: product.map((d) => {
        d.quantity = prodiverProductMap.get(String(d.id))
        d.actualStock = d.pdt_references.reduce((a, b) => a + parseFloat(b.providerStockValue) || 0, 0) >= 0 ? d.pdt_references.reduce((a, b) => a + parseFloat(b.providerStockValue || 0), 0) : 0
        return d
      })
    }
  }
}
