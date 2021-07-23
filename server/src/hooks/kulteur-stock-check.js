// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { GeneralError } from '@feathersjs/errors'

// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    // check new state
    const { quantity, pdtStocksActionId, pdtReferenceId, userUserId } = context.data
    // actions: 1=>ajout 2=>RAZ 3=>booking 4=>sell 5=>cancel booking 6=>cancel by cron 8=>add by kultor 9>waste by kultor
    // if action is booking
    if (parseInt(pdtStocksActionId) === 3 && parseInt(quantity) > 0) {
      // check old state
      const { solde } = await getOldState(pdtReferenceId, context)
      // add new booking if stock is not empty
      if (parseInt(solde) >= parseInt(quantity) && userUserId) {
        // booking < stocks
        context.data.quantity = -quantity
      } else {
        // booking > stocks
        throw new GeneralError(new Error('Plus de stock'))
      }
    }
    if (parseInt(pdtStocksActionId) === 9 && parseInt(quantity) > 0) {
      // check old state
      const { solde } = await getOldState(pdtReferenceId, context)
      // add new waste if stock is not empty
      if (parseInt(solde) >= parseInt(quantity) && !userUserId) {
        // waste < stocks
        context.data.quantity = -quantity
      } else {
        // waste > stocks
        throw new GeneralError(new Error('La quantité perdue est supérieur à la quantité en stock'))
      }
    }
    if (parseInt(pdtStocksActionId) === 3 && parseInt(quantity) <= 0) {
      throw new GeneralError(new Error('Action invalide'))
    }
    // if new stocks
    if (parseInt(pdtStocksActionId) === 1 && userUserId) {
      throw new GeneralError(new Error('Un utilisateur ne peut générer un stock'))
    }
    // if raz stock
    if (parseInt(pdtStocksActionId) === 2 && !userUserId) {
      const { solde } = await getOldState(pdtReferenceId, context)
      context.data.quantity = -parseInt(solde)
    }
    // if cancel by user
    if (parseInt(pdtStocksActionId) === 5 && !userUserId) {
      // add delete booking
      throw new GeneralError(new Error('Un problème est intervenu lors de la suppréssion de votre article'))
    }
    // return context
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
}
