/* eslint-disable camelcase */
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    const { participations, workshops, users, pdt_provider } = sequelize.models

    const participants = {
      model: participations,
      attributes: ['participationId', 'emargement', 'userUserId', 'isPresent'],
      include: [{
        model: users,
        attributes: ['userId', 'firstname', 'lastname', 'email', 'tel']
      }]
    }

    const provider = {
      model: pdt_provider,
      attributes: ['adress']
    }

    if (context.params.query && context.params.query.freeEvents) {
      context.params.sequelize = {
        raw: false,
        where: {
          marketEventId: context.params.query.marketEventId,
          role: context.params.query.role
        }
      }
    } else {
      context.params.sequelize = {
        raw: false,
        include: [workshops, provider, participants]
      }
    }

    return context
  }
}
