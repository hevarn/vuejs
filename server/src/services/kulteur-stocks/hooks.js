import { authenticate } from '@feathersjs/authentication'
import { hooks } from '@feathersjs/authentication-local'
import kulteurStockDisplay from '../../hooks/kulteur-stock-display'
import kulteurStockCheck from '../../hooks/kulteur-stock-check'
import KulteurStockValidation from '../../hooks/kulteur-stock-validation'

export default {
  before: {
    all: [authenticate('jwt')],
    find: [kulteurStockDisplay()],
    get: [kulteurStockDisplay()],
    create: [kulteurStockCheck()],
    update: [KulteurStockValidation()],
    patch: [KulteurStockValidation()],
    remove: [KulteurStockValidation()]
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
