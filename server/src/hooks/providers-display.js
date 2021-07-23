// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // list all objects associated
    const group = {
      model: sequelize.models.pdt_siteGrouping,
      raw: false,
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
    // add new association to array all
    const all = [group]
    // set options
    const groups = {
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      },
      order: sequelize.literal('createdAt DESC'),
      include: [group],
      raw: false
    }
    const providers = {
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
    context.params.sequelize = providers
    if (context.params.query) {
      if (context.params.query.groups) {
        context.params.sequelize = groups
        delete context.params.query.groups
      }
      if (context.params.query.full) {
        context.params.sequelize = full
        delete context.params.query.full
      }
    }
    return context
  }
}
