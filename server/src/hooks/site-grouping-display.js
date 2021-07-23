// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Op } from 'sequelize'

export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    if (context.params.query) {
      if (context.params.query.visitor) {
        delete context.params.query.visitor
        context.params.sequelize = {
          raw: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: {
            model: sequelize.models.pdt_provider,
            raw: false,
            attributes: ['name', 'id', 'isSite'],
            include: [
              {
                model: sequelize.models.marketEvents,
                raw: false,
                attributes: ['receptionOpen', 'receptionClose', 'marketId'],
                include: {
                  model: sequelize.models.market,
                  raw: false,
                  attributes: ['opening', 'closing', 'isOpen'],
                  where: {
                    [Op.or]: [
                      { [Op.and]: [{ closing: { [Op.gte]: new Date() } }, { opening: { [Op.lte]: new Date() } }, { isOpen: true }] }, // Current open market
                      { [Op.and]: [{ opening: { [Op.gte]: new Date() } }, { isOpen: true }] } // Next market
                    ]
                  }
                },
                limit: 30
              }
            ]
          }
        }
        return context
      }
    }

    context.params.sequelize = {
      // default object without association
      raw: false,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
    return context
  }
}
