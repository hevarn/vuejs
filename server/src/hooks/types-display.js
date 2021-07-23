// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated
    const kind = {
      model: sequelize.models.pdt_kind,
      raw: false,
      attributes: ['name', 'id', 'pdtTypeId']
    }
    const variety = {
      ...kind,
      include: {
        model: sequelize.models.pdt_variety,
        raw: false,
        attributes: ['name', 'id', 'picture', 'pdtKindId']
      }
    }
    const product = {
      ...variety,
      include: {
        model: sequelize.models.pdt_product,
        raw: false,
        attributes: ['description', 'id', 'sharedReference', 'spotlight', 'display', 'favouriteRefId',
          'pdtCategoryId', 'pdtCountryId', 'pdtWeightUnityId', 'pdtVarietyId', 'pdtDistanceId']
      }
    }
    // add new association to array all
    const all = [kind, variety, product]
    // set options
    const kinds = {
      attributes: ['id', 'name'],
      include: [kind],
      raw: false
    }
    const varieties = {
      attributes: ['id', 'name'],
      include: [variety],
      raw: false
    }
    const products = {
      attributes: ['id', 'name'],
      include: [product],
      raw: false
    }
    const types = {
      // default object without association
      raw: false,
      attributes: ['name', 'id']
    }
    const full = {
      // get all associations
      attributes: ['id', 'name'],
      include: all,
      raw: false
    }
    //  check queries
    context.params.sequelize = types
    if (context.params.query) {
      if (context.params.query.kinds) {
        context.params.sequelize = kinds
        delete context.params.query.kinds
      }
      if (context.params.query.varieties) {
        context.params.sequelize = varieties
        delete context.params.query.varieties
      }
      if (context.params.query.products) {
        context.params.sequelize = products
        delete context.params.query.products
      }
      if (context.params.query.productList) {
        const { user, query } = context.params
        const providers = user.pdt_provider.pdt_siteGrouping.pdt_providers.filter(x => !x.isSite).map(x => x.id)
        providers.push(user.pdtProviderId)
        context.params.sequelize = {
          raw: false,
          group: [sequelize.col('pdt_kinds.id'), sequelize.col('pdt_type.id'), sequelize.col('pdt_kinds->pdt_varieties.id'), sequelize.col('pdt_kinds->pdt_varieties->pdt_products.id')],
          include: [
            {
              model: sequelize.models.pdt_kind,
              raw: false,
              attributes: ['name', 'id', 'pdtTypeId'],
              required: true,
              order: [['name', 'DESC']],
              include: {
                model: sequelize.models.pdt_variety,
                raw: false,
                attributes: [],
                required: true,
                order: [['name', 'DESC']],
                include: {
                  model: sequelize.models.pdt_product,
                  raw: false,
                  attributes: [],
                  where: { pdtSiteGroupingId: query.productList, display: true },
                  required: true,
                  include: {
                    model: sequelize.models.pdt_references,
                    attributes: [],
                    where: { pdtProviderId: providers },
                    required: user.rank === 'user'
                  }
                }
              }
            }
          ]
        }
        delete context.params.query.productList
      }
      if (context.params.query.full) {
        context.params.sequelize = full
        delete context.params.query.full
      }
    }
    return context
  }
}
