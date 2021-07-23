// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    const commons = {
      // default object without association
      raw: true,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      order: sequelize.literal('name ASC') || sequelize.literal('updatedAt DESC')
    }
    const full = {
      // get all associations
      raw: false
    }
    //  check queries
    context.params.sequelize = commons
    if (context.params.query && context.params.query.full) {
      context.params.sequelize = full
      delete context.params.query.full
    }
    return context
  }
}
