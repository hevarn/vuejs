// A hook that logs service method before, after and error
// See https://github.com/winstonjs/winston for documentation
// about the logger.

import logger from '../logger'

export default function () {
  return context => {
    logger.debug(`${context.type} app.service('${context.path}').${context.method}()`)

    if (context.error && !context.result) {
      logger.error(context.error.stack)
    }
  }
}
