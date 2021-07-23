import { authenticate } from '@feathersjs/authentication'
import { Stripe } from 'stripe'
import { iff, isProvider, isNot } from 'feathers-hooks-common'
import cartDisplay from '../../hooks/cart-display'

async function fetchDiscount (context) {
  const { discount } = await Stripe(context.app.get('Stripe').secretKey).customers.retrieve(
    context.params.user.dataValues.stripeCustomerId
  )
  context.result.discount = discount
  return context
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [cartDisplay()],
    get: [cartDisplay()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [iff(isNot(isProvider('server')), fetchDiscount)],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
