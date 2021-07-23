// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // create object
    const action = {
      model: sequelize.models.pdt_stocksActions,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
    // set options
    const stateStock = {
      attributes: ['pdtReferenceId', [sequelize.fn('sum', sequelize.col('quantity')), 'solde']],
      group: ['pdtReferenceId'],
      order: sequelize.literal('solde DESC'),
      raw: true
    }
    const historyStock = {
      raw: false,
      order: sequelize.literal('createdAt DESC'),
      include: [action]
    }
    const stock = {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      raw: true
    }
    // check queries
    context.params.sequelize = stock
    if (context.params.query.historyStock) {
      context.params.sequelize = historyStock
      delete context.params.query.historyStock
    }
    if (context.params.query.stateStock) {
      context.params.sequelize = stateStock
      delete context.params.query.stateStock
    }
    return context
  }
}
