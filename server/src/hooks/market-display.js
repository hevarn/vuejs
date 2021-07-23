// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const sequelize = context.app.get('sequelizeClient')
    // -------------------------------------------- list all objects can be associated
    const group = {
      model: sequelize.models.pdt_siteGrouping,
      raw: false,
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
    const sites = {
      model: sequelize.models.marketEvents,
      raw: false,
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      },
      include: [
        {
          model: sequelize.models.pdt_provider,
          raw: false,
          attributes: {
            exclude: ['updatedAt', 'createdAt']
          }
        }
      ]
    }

    // --------------------- Object will be return if no query or basic query

    // default object without association
    const withoutAssociation = {
      raw: false,
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      }
    }
    context.params.sequelize = withoutAssociation

    // add new association to array all
    const all = [group, sites]
    // set options
    //  check queries
    if (context.params.query) {
      if (context.params.query.setMarket) {
        // if admin want to set market
        delete context.params.query.setMarket
        context.params.sequelize = {
          attributes: {
            exclude: ['updatedAt', 'createdAt']
          },
          include: [
            {
              model: sequelize.models.marketEvents,
              raw: false,
              attributes: {
                exclude: ['updatedAt', 'createdAt']
              },
              include: [
                {
                  model: sequelize.models.pdt_provider,
                  raw: false,
                  attributes: ['id', 'name', 'adress', 'pdtSiteGroupingId']
                }
              ]
            }
          ],
          raw: false
        }
      }
      if (context.params.query.full) {
        delete context.params.query.full
        context.params.sequelize = {
          attributes: {
            exclude: ['updatedAt', 'createdAt']
          },
          include: all
        }
      }
      return context
    }
  }
}
