import eventDisplay from '../../hooks/event-display'
import logger from '../../logger'

async function freeEvents (context) {
  if (context.params.query.freeEvents) {
    if (context.result.data.length > 0) {
      let counterFreeEvents = context.result.data.length
      let freeEvents = context.result.data.reduce((acc, event) => {
        if (Number(event.userCurrent) < Number(event.userMax)) {
          acc.push(event)
        } else {
          counterFreeEvents -= 1
        }
        return acc
      }, [])
      if (counterFreeEvents === 0) {
        logger.info('create 5 news participants')
        freeEvents = await createParticipants(context)
      }
      logger.info('return only free events')
      context.result.data = freeEvents
    } else {
      // if admin forget create events
      const { receptionOpen, receptionClose, pdtProviderId } = await context.app.service('/api/marketEvents').get(Number(context.params.query.marketEventId))
      context.result.data = await context.app.service('/api/events').create({
        role: 'Reception',
        description: 'Distribution',
        startAt: receptionOpen,
        endAt: receptionClose,
        userCurrent: 0,
        userMax: 999,
        pdtProviderId: pdtProviderId,
        marketEventId: context.params.query.marketEventId
      })
    }
    delete context.params.query.freeEvents
  }
  return context
}

async function createParticipants (context) {
  const promises = context.result.data.map(evenement => {
    logger.info(`create 5 new participants for the id's event : ${evenement.dataValues.eventId}`)
    return context.app.service('/api/events').patch(evenement.dataValues.eventId, { userMax: Number(evenement.dataValues.userMax) + 5 })
  })
  return Promise.all(promises)
}

export default {
  before: {
    all: [],
    find: [eventDisplay()],
    get: [eventDisplay()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [freeEvents],
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
