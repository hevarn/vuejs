// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { GeneralError } from '@feathersjs/errors'

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    // check new state
    const { quantity, pdtStocksActionId, pdtReferenceId } = context.data
    // actions: 1=>ajout 2=>RAZ 3=>booking 4=>sell 5=>cancel booking by user 6=> cancel booking by cron
    const oldAction = await findAction(context)
    // Set id of action we have to patch
    // if action is booking
    if (!oldAction) {
      return context
    }
    context.id = oldAction.id
    if (parseInt(pdtStocksActionId) === 3 && parseInt(quantity) > 0) {
      // check old state
      const { solde } = await getOldState(pdtReferenceId, context)
      // add new booking if stock is not empty
      if (parseInt(solde) - parseInt(oldAction.quantity) >= (parseInt(quantity))) {
        // booking < stocks
        context.data.quantity = -quantity
      } else {
        // booking > stocks
        throw new GeneralError(new Error('Plus de stock'))
      }
    }
    if (parseInt(pdtStocksActionId) === 3 && parseInt(quantity) <= 0) {
      throw new GeneralError(new Error('Action invalide'))
    }
    return context
  }

  async function getOldState (pdtReferenceId, context) {
    try {
      const { data } = await context.app.service('/api/kulteur-stocks').find({ query: { stateStock: true, pdtReferenceId } })
      return data[0]
    } catch (e) {
      console.error(e)
    }
  }

  async function findAction ({ app, data }) {
    const result = await app.service('/api/kulteur-stocks').find({
      query: {
        userUserId: data.userUserId,
        pdtReferenceId: data.pdtReferenceId,
        pdtStocksActionId: 3,
        $sort: { createdAt: -1 },
        $limit: 1
      }
    })
    return result.data[0]
  }
}
