
import commonDisplay from './common-display'

export default {
  // TODO add secure acces hook all: [authenticate('jwt')],
  before: {
    all: [],
    find: [commonDisplay()],
    get: [commonDisplay()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
