// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { GeneralError } from '@feathersjs/errors'
// eslint-disable-next-line no-unused-vars
export default (options = {}) => {
  return async context => {
    if (context.params.user.rank === 'admin' || context.params.user.rank === 'kulteur') {
      return context
    } else {
      throw new GeneralError(new Error('Action réservé à l\'administrateur de Kanopee'))
    }
  }
}
