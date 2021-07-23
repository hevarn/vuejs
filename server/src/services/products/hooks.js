/* eslint-disable camelcase */
import { hooks } from '@feathersjs/authentication-local'
import productDisplay from '../../hooks/product-display'
import isAdminOnly from '../../hooks/isAdmin-display'
import { authenticate } from '@feathersjs/authentication'
import { iff } from 'feathers-hooks-common'

async function toto (context) {
  let isVisitor = false
  if (context.params.query.visitor) {
    isVisitor = true
  }
  return isVisitor
}

export default {
  before: {
    all: [],
    find: [iff(toto, productDisplay()).else(authenticate('jwt'), productDisplay())],
    get: [authenticate('jwt'), productDisplay()],
    create: [authenticate('jwt'), isAdminOnly()],
    update: [authenticate('jwt'), isAdminOnly()],
    patch: [authenticate('jwt'), isAdminOnly()],
    remove: [authenticate('jwt'), isAdminOnly()]
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
