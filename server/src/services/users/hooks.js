import usersDisplay from '../../hooks/users-display'
import { authenticate } from '@feathersjs/authentication'
import { hooks } from '@feathersjs/authentication-local'
import { hooks as verifyHooks } from 'feathers-authentication-management'
import accountService from '../authmanagement/notifier'
import commonHooks from 'feathers-hooks-common'
import { BadRequest } from '@feathersjs/errors'
import {
  Stripe
} from 'stripe'

const { hashPassword, protect } = hooks

async function addSite (context) {
  context.data.pdtName = await context.app.service('/api/providers').get(context.data.pdtProviderId)
  return context
}

async function addStripe (context) {
  const { secretKey } = context.app.get('Stripe')
  const StripeAPI = Stripe(secretKey)
  const { data } = await StripeAPI.customers.list({ email: context.data.email })
  if (data.length > 0) {
    throw new BadRequest('Le compte existe déjà')
  }
  const { id } = await StripeAPI.customers.create({
    email: context.data.email,
    name: context.data.firstname + context.data.lastname,
    phone: context.data.tel,
    address: {
      line1: '',
      postal_code: context.postalCode
    }
  })
  context.data.stripeCustomerId = id
  return context
}

async function notifSite (context) {
  await accountService(context.app).notifier('resendVerifySignup', context.data, context.result)
}

export default {
  before: {
    all: [],
    find: [usersDisplay(), authenticate('jwt')],
    get: [usersDisplay(), authenticate('jwt')],
    create: [
      addSite,
      addStripe,
      hashPassword('password'),
      verifyHooks.addVerification('/api/authManagement')
    ],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [
      commonHooks.iff(
        commonHooks.isProvider('external'),
        commonHooks.preventChanges(true,
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        )
      ),
      authenticate('jwt')
    ]
  },
  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      notifSite,
      verifyHooks.removeVerification('/api/autManagement')
    ],
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
