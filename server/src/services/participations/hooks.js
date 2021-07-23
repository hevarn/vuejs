import { authenticate } from '@feathersjs/authentication'

async function addParticipationInEvent (context) {
  const { dataValues } = await context.app.service('/api/events').get(context.result.evenementEventId)
  await context.app.service('/api/events').patch(context.result.evenementEventId, { userCurrent: Number(dataValues.userCurrent) + 1 })
  return context
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addParticipationInEvent],
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
