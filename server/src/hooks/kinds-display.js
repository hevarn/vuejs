// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated
    const type = {
      model: sequelize.models.pdt_type,
      raw: false,
      attributes: ['name']
    }
    // add new association to array all
    const all = [type]
    // set options
    const types = {
      attributes: ['id', 'name', 'pdtTypeId'],
      include: [type],
      raw: false
    }
    const kinds = {
      // default object without association
      raw: false,
      attributes: ['name', 'id', 'pdtTypeId'],
      order: sequelize.literal('name ASC')
    }
    const full = {
      // get all associations
      attributes: ['id', 'name', 'pdtTypeId'],
      order: sequelize.literal('name ASC'),
      include: all,
      raw: false
    }
    //  check queries
    context.params.sequelize = kinds
    if (context.params.query) {
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
