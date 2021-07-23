import {
  Stripe
} from 'stripe'
import logger from '../../logger'

export default class Service {
  constructor (key) {
    this.stripe = Stripe(key)
  }

  setup (app) {
    this.kulteurStocksService = app.service('/api/kulteur-stocks')
    this.participationsService = app.service('/api/participations')
  }

  async getMissingLinesItems (id) {
    const items = []
    for await (const item of this.stripe.invoices.listLineItems(id, { limit: 100 })) {
      items.push(item)
    }
    return items
  }

  async create ({ data, type }) {
    try {
      logger.info('hook triggered')
      // Handle the event
      if (type === 'invoice.payment_succeeded') {
        const invoice = data.object
        const promises = []
        if (invoice.lines.total_count !== invoice.lines.data.length) {
          invoice.lines.data = await this.getMissingLinesItems(invoice.id)
        }
        await this.participationsService.create({
          evenementEventId: Number(invoice.metadata.eventId),
          userUserId: Number(invoice.metadata.userId),
          emargement: 0
        })
        invoice.lines.data.forEach(async ({ metadata, quantity }) => {
          const pdtReferenceId = Number(metadata.favouriteRefId)
          logger.info(`checking stock for ${pdtReferenceId} ${metadata.isBio} ${quantity} ${invoice.metadata.userId}`)
          if (!metadata.isBio || !(/true/i).test(metadata.isBio)) {
            logger.info(`making reservation for${pdtReferenceId}`)
            promises.push(this.kulteurStocksService.create({
              pdtStocksActionId: 3,
              pdtReferenceId,
              quantity,
              userUserId: Number(invoice.metadata.userId)
            }))
          }
        })
        await Promise.all(promises)
      }
      return 200
    } catch (e) {
      logger.error(e)
      return e
    }
  }
}
