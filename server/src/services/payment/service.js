import {
  Stripe
} from 'stripe'
import { NotAcceptable, BadRequest } from '@feathersjs/errors'
import DisplayedProduct from '../../utils/product'
export default class Service {
  constructor (key, tva55, tva20) {
    this.stripe = Stripe(key)
    this.tva55 = tva55
    this.tva20 = tva20
  }

  setup (app) {
    this.cartService = app.service('/api/cart')
    this.kulteurStocksService = app.service('/api/kulteur-stocks')
    this.workshopsService = app.service('/api/workshops')
  }

  patch (id, { delivered }) {
    return this.stripe.invoices.update(id, {
      metadata: {
        delivered
      }
    })
  }

  async find ({ user, query }) {
    const invoices = []
    const request = {
      customer: user.dataValues.stripeCustomerId,
      limit: query.limit || 100,
      expand: ['data.charge']
    }
    if (query.status) {
      request.status = query.status
    }
    if (query.created) {
      delete request.customer
      request.created = query.created
    }
    for await (const invoice of this.stripe.invoices.list(request)) {
      const invoiceProviderId = Number(invoice.metadata.pdtProviderId)
      const invoiceMarketId = Number(invoice.metadata.marketId)
      if (query.delivered && invoice.metadata.delivered === undefined) {
        // if old bills add delivered variable
        invoice.metadata.delivered = 0
      }
      if (query.siteId && invoiceProviderId !== Number(query.siteId)) {
        continue
      }
      if (query.marketId && invoiceMarketId !== Number(query.marketId)) {
        continue
      }
      // admin, filter out refunds
      if ((query.siteId || query.marketId) && (invoice.charge && invoice.charge.refunded)) {
        continue
      }
      // admin, filter out credit
      if ((query.siteId || query.marketId) && (invoice.post_payment_credit_notes_amount === invoice.total)) {
        continue
      }
      if (query.delivered && (Number(invoice.metadata.delivered) !== Number(query.delivered))) {
        continue
      }
      if (!query.workshop && Number(invoice.metadata.workshopId)) {
        continue
      }
      invoice.lines.data.sort((a, b) => {
        if (a.description.toLowerCase() < b.description.toLowerCase()) {
          return -1
        } else {
          return 1
        }
      })
      invoices.push(invoice)
    }
    return invoices
  }

  async get (id) {
    return this.stripe.invoices.retrieve(id)
  }

  async voidAllInvoice (customer) {
    const { data: invoicesToVoid } = await this.stripe.invoices.list({
      customer,
      status: 'open'
    })
    return invoicesToVoid.map(({ id }) => this.stripe.invoices.voidInvoice(id))
  }

  async deleteOldInvoiceItems (customer) {
    const invoicesToVoid = []
    for await (const item of this.stripe.invoiceItems.list({
      customer,
      pending: true,
      limit: 100
    })) {
      invoicesToVoid.push(this.stripe.invoiceItems.del(item.id))
    }
    return invoicesToVoid
  }

  async create ({ pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId }, { user }) {
    const customer = user.dataValues.stripeCustomerId
    const KulteurName = user.pdt_provider.dataValues.nameKultor || 'Non renseigné'
    const marketEvents = user.pdt_provider.marketEvents.map(x => x.toJSON())
    const { market } = marketEvents.sort((a, b) => (a.market.opening - b.market.opening))[0]
    // Fetch olvInvoiceItems + cart
    if (workshopId) {
      return this.paymentWorkshop(pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, market)
    } else {
      return this.paymentItems(pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, market)
    }
  }

  formatHours (ts) {
    return new Date(ts).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric' })
  }

  async checkStocks (cartItems, minAmount) {
    let total = 0
    const items = cartItems.map(c => {
      const p = new DisplayedProduct(c.pdt_product, c.quantity)
      total += p.lastSellPrice * p.qty
      if (((!p.isBio || !(/true/i).test(p.isBio)) && p.stock < p.qty) || !p.display) {
        throw new NotAcceptable('Produit non disponible', { pdtReferenceId: p.favouriteRefId })
      }
      return p
    })
    if (total < minAmount) {
      throw new BadRequest(`Le montant minimal est de ${minAmount} €`)
    }
    return items
  }

  createInvoiceItem (item, customer, market) {
    const currentTs = Math.floor(Date.now() / 1000)
    const { providerReference } = item.referencesPdt.find(({ id }) => item.favouriteRefId === id)
    return this.stripe.invoiceItems.create({
      description: `${item.kind} ${item.variety} ${item.isBio ? '(bio)' : '(0 km)'}`,
      unit_amount: Math.round(Number(item.lastSellPrice * 100)),
      currency: 'eur',
      quantity: item.qty,
      customer,
      metadata: {
        imageURL: item.picture,
        favouriteRefId: item.favouriteRefId,
        isBio: item.isBio,
        pdtProductId: item.id,
        packaging: item.sellUnity || item.unity,
        disassemble: item.disassemble,
        providerReference: providerReference,
        referenceProduct: item.favouriteRefName,
        cartId: item.product.idCart,
        marketId: market.id
      },
      period: {
        start: currentTs,
        end: currentTs
      }
    })
  }

  async createInvoiceWorkshop (customer, workshopId, market) {
    const { name, price, description, evenementEventId } = await this.workshopsService.get(workshopId)
    return this.stripe.invoiceItems.create({
      description: name,
      unit_amount: price * 100,
      currency: 'eur',
      metadata: {
        description,
        evenementEventId,
        marketId: market.id
      },
      customer
    })
  }

  async createInvoice (pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, tva, description, market) {
    const siteName = user.pdt_provider.dataValues.name.substring(0, 25) + '...'
    return this.stripe.invoices.create({
      description,
      metadata: {
        userId: user.dataValues.userId,
        pdtProviderId,
        pdtSiteGroupingId,
        delivered: 0,
        providerAdress: user.pdt_provider.dataValues.adress,
        siteName,
        KulteurName,
        eventId,
        eventStartAt,
        eventEndAt,
        workshopId,
        marketId: market.id,
        ordered: 0
      },
      default_tax_rates: [tva],
      custom_fields: [
        { name: 'Site', value: siteName },
        { name: 'Kulteur référent', value: KulteurName }
      ],
      customer
    })
  }

  async finalizeInvoice (id) {
    const { hosted_invoice_url: url, payment_intent: intent } = await this.stripe.invoices.finalizeInvoice(id, {
      auto_advance: false,
      expand: ['payment_intent']
    })
    let isPaid = false
    let secret = ''
    if (!intent) {
      isPaid = true
    } else {
      secret = intent.client_secret
    }
    return { url, secret, isPaid }
  }

  async paymentWorkshop (pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, market) {
    await this.createInvoiceWorkshop(customer, workshopId, market)
    const description = `Rendez-vous au :
    ${user.pdt_provider.dataValues.adress},
    le ${new Date(eventStartAt).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}`
    const invoice = await this.createInvoice(pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, this.tva20, description, market)
    return this.finalizeInvoice(invoice.id)
  }

  async paymentItems (pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, market) {
    const [invoiceItemsToVoid, invoiceToVoid, cartItems] = await Promise.all([
      this.deleteOldInvoiceItems(customer),
      this.voidAllInvoice(customer),
      this.cartService.find({ query: { userUserid: user.dataValues.userId } })
    ])
    // Check Stocks + cart amount
    const items = await this.checkStocks(cartItems.map(x => x.toJSON()), market.minAmount) // min amount from site
    // Create invoiceItems
    await Promise.all([...items.map(cartItem => this.createInvoiceItem(cartItem, customer, market)), ...invoiceToVoid, ...invoiceItemsToVoid])
    const description = `À venir récupérer au :
  ${user.pdt_provider.dataValues.adress},
  le ${new Date(eventStartAt).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })} entre ${this.formatHours(eventStartAt)} et ${this.formatHours(eventEndAt)}`
    const invoice = await this.createInvoice(pdtSiteGroupingId, pdtProviderId, eventId, eventStartAt, eventEndAt, workshopId, user, customer, KulteurName, this.tva55, description, market)
    return this.finalizeInvoice(invoice.id)
  }
}
