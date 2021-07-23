import {
  Stripe
} from 'stripe'

export default class Service {
  constructor (key) {
    this.stripe = Stripe(key)
  }

  async get (loc, { user }) {
    return this.stripe.billingPortal.sessions.create({
      customer: user.dataValues.stripeCustomerId,
      return_url: `${decodeURI(loc)}/account`
    })
  }

  async update (id, { query }, { user }) {
    if (query.remove) {
      return this.stripe.paymentMethods.detach(id)
    } else {
      await this.stripe.customers.update(user.dataValues.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: id
        }
      })
      return 200
    }
  }

  async find ({ user }) {
    const request = {
      customer: user.dataValues.stripeCustomerId,
      type: 'card'
    }
    const { data } = await this.stripe.paymentMethods.list(request)
    const { invoice_settings: setting } = await this.stripe.customers.retrieve(user.dataValues.stripeCustomerId)
    return data.map((method) => {
      if (method.id === setting.default_payment_method) {
        method.isDefault = true
      }
      return method
    })
  }

  setupPaymentMethod (domainURL, customer, userId) {
    return this.stripe.checkout.sessions.create({
      customer,
      success_url: `${domainURL}/account`,
      cancel_url: `${domainURL}/account`,
      payment_method_types: ['card'],
      client_reference_id: userId,
      mode: 'setup'
    })
  }

  async create ({ id, domainURL }, { user, query }) {
    if (query.mode === 'attach') {
      // attach a paiement method to a user
      return this.stripe.paymentMethods.attach(id, { customer: user.dataValues.stripeCustomerId })
    } else if (query.mode === 'setup') {
      // create a setupIntent for later uses
      return this.setupPaymentMethod(domainURL, user.dataValues.stripeCustomerId, user.dataValues.userId)
    }
  }
}
