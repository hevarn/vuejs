import { Stripe } from 'stripe'
export default class Service {
  constructor (key) {
    this.stripe = Stripe(key)
  }

  async get (id, { user }) {
    const coupon = await this.stripe.coupons.retrieve(id)
    if (coupon.valid) {
      await this.stripe.customers.update(user.dataValues.stripeCustomerId, { coupon: coupon.id })
    } else {
      throw new Error('coupon non valide')
    }
    return coupon
  }

  async update (id, data, { user }) {
    return this.stripe.customers.update(user.dataValues.stripeCustomerId, data)
  }
}
