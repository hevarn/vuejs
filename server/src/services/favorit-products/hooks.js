/* eslint-disable camelcase */
import { authenticate } from '@feathersjs/authentication'
import { hooks } from '@feathersjs/authentication-local'
import favoritDisplay from '../../hooks/favorit-products-display'

export default {
  before: {
    all: [authenticate('jwt')],
    find: [favoritDisplay()],
    get: [favoritDisplay()],
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
