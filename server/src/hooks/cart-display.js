// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    // const { user, query } = context.params
    const sequelize = context.app.get('sequelizeClient')

    const sellHistory = {
      model: sequelize.models.pdt_sellHistory,
      attributes: ['id', 'sellPrice'],
      order: [['id', 'DESC']],
      limit: 1
    }

    const variety = {
      model: sequelize.models.pdt_variety,
      attributes: ['id', 'name', 'picture', 'pdtKindId', 'preparationAdvice', 'description'],
      include: [{
        model: sequelize.models.pdt_kind,
        attributes: ['id', 'name', 'pdtTypeId'],
        include: [{
          model: sequelize.models.pdt_type,
          attributes: ['id', 'name']
        }]
      }]
    }

    const unity = {
      model: sequelize.models.pdt_weight_unity,
      as: 'buyUnity',
      attributes: ['id', 'name']
    }

    const newUnity = {
      model: sequelize.models.pdt_weight_unity,
      as: 'sellUnity',
      attributes: ['id', 'name']
    }

    context.params.sequelize = {
      raw: false,
      group: [
        sequelize.col('cart.id'),
        sequelize.col('pdt_product.id'),
        sequelize.col('pdt_product.pdt_references.id'),
        sequelize.col('pdt_product.pdt_references.pdt_kulteurStocks.pdtReferenceId')
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: {
        model: sequelize.models.pdt_product,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [sellHistory, variety, newUnity, unity,
          {
            model: sequelize.models.pdt_references,
            attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId',
              [sequelize.fn('SUM', sequelize.col('pdt_product.pdt_references.pdt_kulteurStocks.quantity')), 'kultorStockValue']],
            include: {
              model: sequelize.models.pdt_kulteurStocks,
              attributes: []
            }
          }]
      }
    }
    return context
  }
}
