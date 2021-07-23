// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated
    const provider = {
      model: sequelize.models.pdt_provider,
      raw: false,
      attributes: ['name', 'pdtSiteGroupingId']
    }
    const product = {
      model: sequelize.models.pdt_product,
      raw: false,
      attributes: ['id', 'pdtWeightUnityId'],
      include: [{
        model: sequelize.models.pdt_weight_unity,
        as: 'buyUnity',
        attributes: ['name']
      }]
    }
    const reference = {
      model: sequelize.models.pdt_references,
      raw: false,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      include: [provider, product]
    }

    // add new association to array all
    const all = [reference]
    // set options
    const references = {
      include: [reference],
      raw: false
    }
    const orders = {
      // default object without association
      raw: false
    }
    const full = {
      // get all associations
      include: all,
      raw: false
    }
    //  check queries
    context.params.sequelize = orders
    if (context.params.query.references) {
      context.params.sequelize = references
      delete context.params.query.references
    }
    if (context.params.query.full) {
      context.params.sequelize = full
      delete context.params.query.full
    }
    return context
  }
}
