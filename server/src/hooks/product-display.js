// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Unavailable } from '@feathersjs/errors'

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    const { user, query } = context.params
    const sequelize = context.app.get('sequelizeClient')
    // --------------------------------- general association ---------------------------------------

    let variety = {
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
      attributes: ['id', 'name', 'providerName']
    }

    const category = {
      model: sequelize.models.pdt_category,
      attributes: ['id', 'name', 'providerName']
    }

    const distance = {
      model: sequelize.models.pdt_distance,
      attributes: ['id', 'name']
    }

    const country = {
      model: sequelize.models.pdt_country,
      attributes: ['id', 'name']
    }

    // -------------------------------- association with where clause ----------------------------------

    if (query) {
      if (query.types) {
        variety = {
          model: sequelize.models.pdt_variety,
          attributes: ['id', 'name', 'picture', 'pdtKindId', 'preparationAdvice', 'description'],
          required: true,
          include: [{
            model: sequelize.models.pdt_kind,
            attributes: ['id', 'name', 'pdtTypeId'],
            where: { pdtTypeId: query.types },
            required: true,
            include: [{
              model: sequelize.models.pdt_type,
              attributes: ['id', 'name']
            }]
          }]
        }
        delete query.types
      }
      if (query.kind) {
        variety = {
          model: sequelize.models.pdt_variety,
          attributes: ['id', 'name', 'picture', 'pdtKindId', 'preparationAdvice', 'description'],
          where: { pdtKindId: query.kind },
          include: [{
            model: sequelize.models.pdt_kind,
            attributes: ['id', 'name', 'pdtTypeId'],
            include: [{
              model: sequelize.models.pdt_type,
              attributes: ['id', 'name']
            }]
          }]
        }
        delete query.kind
      }
    }

    // ------------------------- cheking function below ------------------------------------------------

    function checkOpeningMarket () {
      user.pdt_provider.marketEvents.sort((a, b) => (a.market.opening - b.market.opening))
      const { opening, closing, isOpen } = user.pdt_provider.marketEvents[0].market
      if ((new Date() < opening || new Date() > closing) && context.params.user.rank !== 'admin') {
        throw new Unavailable(`Le marché n'est pas encore ouvert. Prochaine ouverture le ${new Date(opening).toLocaleString()}`)
      }
      if (!isOpen && context.params.user.rank !== 'admin') {
        throw new Unavailable('Pour une raison technique, le marché est temporairement fermé. Mais on met tout en oeuvre pour le réouvrir rapidement !')
      }
      return true
    }

    // -------------------------- return context below ---------------------------------------------------

    if (!user && query.orderInfo) {
      // if retrieve products carts for orderInfo
      context.params.sequelize = {
        raw: false,
        group: [
          sequelize.col('pdt_product.id'),
          sequelize.col('pdt_references.id'),
          sequelize.col('pdt_references.pdt_kulteurStocks.pdtReferenceId'),
          sequelize.col('pdt_references->pdt_buyHistories.id'),
          sequelize.col('pdt_references->pdt_kulteurStocks.id')
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [variety, newUnity, unity, category, distance, country,
          {
            model: sequelize.models.pdt_references,
            attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId',
              [sequelize.fn('SUM', sequelize.col('pdt_references.pdt_kulteurStocks.quantity')), 'kultorStockValue'],
              [sequelize.fn('SUM', sequelize.col('pdt_references.pdt_stocks.qtyReceived')), 'providerStockValue']],
            include: [{
              model: sequelize.models.pdt_kulteurStocks,
              attributes: {
                exclude: ['createdAt', 'updatedAt']
              }
            },
            {
              model: sequelize.models.pdt_provider,
              attributes: ['name']
            },
            {
              model: sequelize.models.pdt_stocks,
              attributes: []
            },
            {
              model: sequelize.models.pdt_buyHistory,
              attributes: {
                exclude: ['updatedAt']
              }
            }]
          }]
      }
      delete query.orderInfo
      return context
    }

    // ------------------------------ if user is a visitor --------------------------------------------

    if (!user && query.visitor) {
      Object.assign(context.params.query, { display: 1, $sort: { sharedReference: 1 }, isArchived: 0 })
      context.params.sequelize = {
        raw: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        group: [
          sequelize.col('pdt_product.id'),
          sequelize.col('pdt_references.id'),
          sequelize.col('pdt_references.pdt_kulteurStocks.pdtReferenceId')
        ],
        required: true,
        include: [variety, newUnity, unity, category, distance,
          {
            model: sequelize.models.pdt_references,
            attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId',
              [sequelize.fn('SUM', sequelize.col('pdt_references.pdt_kulteurStocks.quantity')), 'kultorStockValue']],
            where: { pdtProviderId: query.providers },
            include: {
              model: sequelize.models.pdt_kulteurStocks,
              attributes: []
            }
          },
          {
            model: sequelize.models.pdt_sellHistory,
            attributes: ['id', 'sellPrice'],
            order: [['id', 'DESC']],
            limit: 1
          }]
      }
      delete query.providers
      delete query.visitor
      return context
    }

    // ------------------------------ if user or admin -------------------------------------------------

    if (user.rank === 'admin' || user.rank === 'kulteur') {
      // if user is admin
      if (query) {
        // use query
        Object.assign(context.params.query, { $sort: { sharedReference: 1 } })
        if (query.fetchByProvider || query.providers) {
          context.params.sequelize = {
            raw: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            group: [
              sequelize.col('pdt_product.id'),
              sequelize.col('pdt_references.pdtProductId'),
              sequelize.col('pdt_references.id'),
              sequelize.col('pdt_references.pdt_kulteurStocks.pdtReferenceId'),
              sequelize.col('pdt_references->pdt_buyHistories.id'),
              sequelize.col('othersRef.id')
            ],
            include: [variety, newUnity, unity, category, distance, country,
              {
                model: sequelize.models.pdt_references,
                attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId',
                  [sequelize.fn('SUM', sequelize.col('pdt_references.pdt_kulteurStocks.quantity')), 'kultorStockValue'],
                  [sequelize.fn('SUM', sequelize.col('pdt_references.pdt_stocks.qtyReceived')), 'providerStockValue']],
                include: [{
                  model: sequelize.models.pdt_kulteurStocks,
                  attributes: []
                },
                {
                  model: sequelize.models.pdt_provider,
                  attributes: ['name']
                },
                {
                  model: sequelize.models.pdt_stocks,
                  attributes: []
                },
                {
                  model: sequelize.models.pdt_buyHistory,
                  attributes: {
                    exclude: ['updatedAt']
                  }
                }]
              },
              {
                // re-use pdt_references for filtering products displayed fy ref provider
                model: sequelize.models.pdt_references,
                as: 'othersRef',
                where: { pdtProviderId: query.fetchByProvider || query.providers },
                required: true
              },
              {
                model: sequelize.models.pdt_sellHistory,
                attributes: ['id', 'sellPrice', 'createdAt', 'updatedAt', 'ratio'],
                order: [['id', 'DESC']],
                limit: 10
              }]
          }
          delete query.fetchByProvider
          delete query.providers
          return context
        } else if (query.mercu) {
          // req used for mercurial
          delete query.mercu
          context.params.sequelize = {
            raw: false,
            attributes: ['sharedReference', 'id', 'pdtVarietyId'],
            include: [{
              model: sequelize.models.pdt_references,
              attributes: ['providerReference']
            }]
          }
        }
      } else {
        // send basic object withouth association
        context.params.sequelize = {
          raw: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      }
    } else if (user.rank === 'user') {
      // if user is user
      if (query) {
        // use query
        if (user.pdtProviderId && checkOpeningMarket()) {
          const providers = user.pdt_provider.pdt_siteGrouping.pdt_providers.filter(x => !x.isSite).map(x => x.id)
          providers.push(user.pdtProviderId)
          Object.assign(context.params.query, { pdtSiteGroupingId: user.pdt_provider.pdtSiteGroupingId, display: 1, $sort: { sharedReference: 1 } })
          context.params.sequelize = {
            raw: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            group: [
              sequelize.col('pdt_product.id'),
              sequelize.col('pdt_references.id'),
              sequelize.col('pdt_references.pdt_kulteurStocks.pdtReferenceId'),
              sequelize.col('favoritProducts.id')
            ],
            required: true,
            include: [variety, newUnity, unity, category, distance,
              {
                model: sequelize.models.pdt_references,
                attributes: ['id', 'kanopeeReference', 'providerReference', 'infoRef', 'package', 'pdtProviderId', 'pdtProductId',
                  [sequelize.fn('SUM', sequelize.col('pdt_references.pdt_kulteurStocks.quantity')), 'kultorStockValue']],
                where: { pdtProviderId: providers },
                include: {
                  model: sequelize.models.pdt_kulteurStocks,
                  attributes: []
                }
              },
              {
                model: sequelize.models.favoritProducts,
                attributes: {
                  exclude: ['createdAt', 'updatedAt']
                },
                where: { userUserId: user.userId },
                required: !!query.favorit
              },
              {
                model: sequelize.models.pdt_sellHistory,
                attributes: ['id', 'sellPrice'],
                order: [['id', 'DESC']],
                limit: 1
              }]
          }
          delete query.favorit
          return context
        }
      } else {
        // send basic object without association
        context.params.sequelize = {
          raw: false,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      }
    } else {
      throw new Unavailable('Vous ne pouvez accéder aux fiches produits')
    }
  }
}
