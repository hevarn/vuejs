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
    const type = {
      ...kind,
      include: {
        model: sequelize.models.pdt_type,
        raw: false,
        attributes: ['name', 'id']
      }
    }
    // our alone object
    const variety = {
      raw: false,
      attributes: ['name', 'id', 'picture', 'pdtKindId', 'preparationAdvice', 'description'],
      order: sequelize.literal('name ASC')
    }
    // add new association to array all
    const all = [type, kind]
    // set options
    const kinds = {
      ...variety,
      include: [kind],
      raw: false
    }
    const types = {
      ...variety,
      include: [type],
      raw: false
    }
    const varieties = {
      // default object without association
      ...variety
    }
    const full = {
      // get all associations
      ...variety,
      include: all
    }
    //  check queries
    context.params.sequelize = varieties
    if (context.params.query) {
      if (context.params.query.kinds) {
        context.params.sequelize = kinds
        delete context.params.query.kinds
      }
      if (context.params.query.types) {
        context.params.sequelize = types
        delete context.params.query.types
      }
      if (context.params.query.full) {
        context.params.sequelize = full
        delete context.params.query.full
      }
    }
    return context
  }
}
