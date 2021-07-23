// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated
    const history = {
      model: sequelize.models.pdt_buyHistory,
      raw: false,
      attributes: ['id', 'buyPrice1', 'buyPrice2', 'buyPrice3', 'buyPrice4', 'buyPrice5', 'pdtReferenceId', 'createdAt'],
      order: sequelize.literal('createdAt DESC')
    }
    const stock = {
      model: sequelize.models.pdt_stocks,
      order: sequelize.literal('solde DESC'),
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true
    }
    const product = {
      model: sequelize.models.pdt_product,
      include: {
        model: sequelize.models.pdt_variety,
        attributes: ['picture']
      }
    }
    // add new association to array all
    const all = [history, stock]
    // set options
    const histories = {
      attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'createdAt'],
      order: sequelize.literal('createdAt DESC'),
      include: [history],
      raw: false
    }
    const references = {
      // default object without association
      raw: false,
      attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId']
    }
    const kultors = {
      raw: false,
      group: ['pdt_references.id'],
      attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId',
        [sequelize.fn('SUM', sequelize.col('pdt_kulteurStocks.quantity')), 'kulteurStockValue']],
      include: [product,
        {
          model: sequelize.models.pdt_kulteurStocks,
          attributes: []
        }]
    }
    const full = {
      // get all associations
      attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId'],
      include: all,
      raw: false
    }
    //  check queries
    context.params.sequelize = references
    if (context.params.query.histories) {
      context.params.sequelize = histories
      delete context.params.query.histories
    }
    if (context.params.query.kultors) {
      context.params.sequelize = kultors
      delete context.params.query.kultors
    }
    if (context.params.query.full) {
      context.params.sequelize = full
      delete context.params.query.full
    }
    return context
  }
}
