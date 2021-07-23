/* eslint-disable camelcase */
import { authenticate } from '@feathersjs/authentication'
import { hooks } from '@feathersjs/authentication-local'
import orderProviderDisplay from '../../hooks/order-provider-display'
import isAdminOnly from '../../hooks/isAdmin-display'

export default {
  before: {
    all: [authenticate('jwt'), isAdminOnly()],
    find: [orderProviderDisplay()],
    get: [orderProviderDisplay()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      hooks.protect('password')
    ],
    find: [],
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
