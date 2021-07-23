// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Op } from 'sequelize'
// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated

    const provider = {
      model: sequelize.models.pdt_provider,
      raw: false,
      attributes: ['id', 'name', 'code', 'adress', 'isSite', 'nbEmployees',
        'pdtSiteGroupingId', 'nameKultor', 'receptionOpen', 'receptionClose', 'minAmount', 'scheduleImg'
      ],
      include: [
        {
          model: sequelize.models.pdt_siteGrouping,
          raw: false,
          attributes: ['id', 'name', 'opening', 'closing', 'isOpen'],
          include: {
            model: sequelize.models.pdt_provider,
            raw: false,
            attributes: ['id', 'isSite']
          }
        },
        {
          model: sequelize.models.marketEvents,
          raw: false,
          attributes: ['id', 'pdtProviderId', 'marketId', 'receptionOpen', 'receptionClose'],
          include: {
            model: sequelize.models.market,
            raw: false,
            attributes: ['id', 'name', 'opening', 'closing', 'isOpen', 'minAmount'],
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

    if (context.params.query && context.params.query.mini) {
      delete context.params.query.mini
      context.params.sequelize = {
        raw: false,
        attributes: {
          exclude: ['updatedAt']
        },
        include: [
          {
            model: sequelize.models.pdt_provider,
            attributes: ['name']
          }
        ]
      }
      return context
    }

    const user = {
      raw: false,
      attributes: {
        exclude: ['updatedAt']
      },
      required: true
    }
    // add new association to array all
    const all = [provider]
    // set options
    const providers = {
      ...user,
      raw: false
    }
    const users = {
      // default object without association
      ...user,
      include: [provider]
    }
    const full = {
      // get all associations
      ...user,
      include: all
    }

    //  check queries
    context.params.sequelize = users

    if (context.arguments[0] === context.id) {
      context.params.query = {
        full: true
      }
    }
    if (context.params.query.providers) {
      context.params.sequelize = providers
      delete context.params.query.providers
    }
    if (context.params.query.full) {
      context.params.sequelize = full
      delete context.params.query.full
    }
    return context
  }
}
