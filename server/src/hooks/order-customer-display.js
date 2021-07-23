// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    // Get the Sequelize instance. In the generated application via:
    const sequelize = context.app.get('sequelizeClient')

    const unity = {
      model: sequelize.models.pdt_weight_unity,
      as: 'buyUnity',
      attributes: ['name']
    }

    const name = {
      model: sequelize.models.pdt_variety,
      attributes: ['name', 'picture', 'pdtKindId'],
      include: [{
        model: sequelize.models.pdt_kind,
        attributes: ['name']
      }]
    }

    const siteGrouping = {
      required: true,
      model: sequelize.models.pdt_siteGrouping,
      attributes: ['opening', 'closing']
    }

    let paramsWhere = {}

    const fetchWithUserId = {
      raw: false,
      attributes: ['createdAt', 'orderId', 'paidId', 'coupon', 'priceTotalTTC', 'delivred'],
      include: [{
        model: sequelize.models.users,
        attributes: ['firstname', 'lastname', 'email', 'userId'],
        include: [{
          model: sequelize.models.pdt_provider,
          attributes: ['name', 'adress', 'pdtSiteGroupingId', 'name'],
          include: [siteGrouping]
        }]
      }]
    }

    const fetchWithOrderId = {
      raw: false,
      attributes: ['id', 'qty', 'priceTotalTTC', 'pdtProductId', 'received', 'delivred', 'createdAt'],
      include: [{
        model: sequelize.models.pdt_product,
        attributes: ['id', 'pdtVarietyId', 'display', 'pdtDistanceId', 'favouriteRefId', 'sharedReference'],
        include: [
          name,
          {
            model: sequelize.models.pdt_sellHistory,
            attributes: ['sellPrice', 'id']
          },
          unity
        ]
      }]
    }

    const fetchWithGroupId = {
      raw: false,
      include: [{
        required: true,
        model: sequelize.models.users,
        attributes: ['firstname', 'lastname', 'email'],
        include: [{
          required: true,
          model: sequelize.models.pdt_provider,
          where: {
            pdtSiteGroupingId: Number(context.params.query.groupId)
          },
          attributes: ['name', 'adress', 'receptionOpen', 'receptionClose', 'pdtSiteGroupingId'],
          include: [siteGrouping]
        }]
      },
      {
        model: sequelize.models.pdt_product,
        attributes: ['id', 'favouriteRefId', 'pdtDistanceId'],
        include: [
          name,
          {
            model: sequelize.models.pdt_sellHistory,
            attributes: ['sellPrice', 'id']
          },
          {
            model: sequelize.models.pdt_distance,
            attributes: ['name']
          },
          {
            model: sequelize.models.pdt_references,
            include: [{
              model: sequelize.models.pdt_buyHistory,
              attributes: ['buyPrice1', 'buyPrice2', 'buyPrice3', 'buyPrice4', 'buyPrice5']
            }, {
              model: sequelize.models.pdt_provider,
              attributes: ['id', 'name', 'adress', 'isSite', 'receptionOpen', 'receptionClose', 'packaging1', 'packaging2', 'packaging3', 'packaging4', 'packaging5']
            }]
          },
          unity
        ]
      }
      ]
    }

    const productAdmin = {
      model: sequelize.models.pdt_product,
      attributes: ['id', 'favouriteRefId'],
      include: [name, unity]
    }

    const fetchAdmin = {
      raw: false,
      attributes: ['qty', 'priceTotalTTC', 'createdAt', 'orderId', 'paidId', 'coupon', 'pdtProductId'],
      include: [{
        model: sequelize.models.users,
        attributes: ['firstname', 'lastname', 'email']
      }, productAdmin]
    }

    if (context.params.query.email) {
      paramsWhere = {
        email: context.params.query.email
      }
    } else if (context.params.query.lastname) {
      paramsWhere = {
        lastname: context.params.query.lastname
      }
    }
    const fetchAdminWithWhere = {
      raw: false,
      required: true,
      attributes: ['qty', 'priceTotalTTC', 'createdAt', 'orderId', 'paidId', 'coupon', 'pdtProductId'],
      include: [{
        required: true,
        model: sequelize.models.users,
        where: paramsWhere,
        attributes: ['firstname', 'lastname', 'email']
      }, productAdmin]
    }

    if (context.params.query.admin) {
      if (context.params.query.email) {
        context.params.sequelize = fetchAdminWithWhere
        delete context.params.query.email
      } else if (context.params.query.lastname) {
        context.params.sequelize = fetchAdminWithWhere
        delete context.params.query.lastname
      } else {
        context.params.sequelize = fetchAdmin
        delete context.params.query.lastname
      }
      delete context.params.query.admin
    } else {
      if (context.params.query.userUserId) {
        context.params.sequelize = fetchWithUserId
      }
      if (context.params.query.orderId) {
        context.params.sequelize = fetchWithOrderId
      }
      if (context.params.query.groupId) {
        context.params.sequelize = fetchWithGroupId
        delete context.params.query.groupId
      }
    }

    return context
  }
}
