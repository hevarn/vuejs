// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated

    // add new association to array all
    const all = []
    // set options
    const stateStock = {
      attributes: ['pdtReferenceId', [sequelize.fn('sum', sequelize.col('qtyReceived')), 'solde']],
      group: ['pdtReferenceId'],
      order: sequelize.literal('solde DESC'),
      raw: true
    }
    const unity = {
      model: sequelize.models.pdt_weight_unity,
      as: 'buyUnity',
      attributes: ['name']
    }
    const product = {
      model: sequelize.models.pdt_product,
      attributes: ['pdtVarietyId'],
      include: [{
        model: sequelize.models.pdt_variety,
        attributes: ['picture']
      },
      unity]
    }
    const stateStockByRef = {
      attributes: ['pdtReferenceId', [sequelize.fn('sum', sequelize.col('qtyReceived')), 'solde'], [sequelize.fn('avg', sequelize.col('buyPrice')), 'price']],
      group: ['pdtReferenceId'],
      order: sequelize.literal('solde DESC'),
      include: [
        {
          model: sequelize.models.pdt_references,
          attributes: ['kanopeeReference', 'providerReference', 'infoRef'],
          where: { pdtProviderId: context.params.query.stateStockByRef },
          required: true,
          include: [product]
        }
      ],
      raw: false
    }
    const stocks = {
      // default object without association
      raw: false,
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
    const full = {
      // get all associations
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      },
      include: all,
      raw: false
    }
    //  check queries
    context.params.sequelize = stocks
    if (context.params.query.stocks) {
      context.params.sequelize = stocks
      delete context.params.query.stocks
    }
    if (context.params.query.stateStock) {
      context.params.sequelize = stateStock
      delete context.params.query.stateStock
    }
    if (context.params.query.stateStockByRef) {
      context.params.sequelize = stateStockByRef
      delete context.params.query.stateStockByRef
    }
    if (context.params.query.full) {
      context.params.sequelize = full
      delete context.params.query.full
    }
    return context
  }
}
