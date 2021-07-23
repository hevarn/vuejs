
import { hooks } from '@feathersjs/authentication-local'
import providersDisplay from '../../hooks/providers-display'
import isAdminOnly from '../../hooks/isAdmin-display'
import { authenticate } from '@feathersjs/authentication'

export default {
  before: {
    all: [],
    find: [providersDisplay()], // register call this road for select site
    get: [authenticate('jwt')],
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
