import { authenticate } from '@feathersjs/authentication'
import commonDisplay from './common-display'

import { hooks } from '@feathersjs/authentication-local'

export default {
  before: {
    all: [authenticate('jwt')],
    find: [commonDisplay()],
    get: [commonDisplay()],
    create: [commonDisplay()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [hooks.protect('password')],
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
