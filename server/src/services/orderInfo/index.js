import hooks from '../../hooks/common'
import Service from './service'

export default function (app) {
  const { secretKey } = app.get('Stripe')

  // Initialize our service with any options it requires
  app.use('/api/orderInfo', new Service(secretKey))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/orderInfo')

  service.hooks(hooks)
}
