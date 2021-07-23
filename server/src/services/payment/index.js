import Service from './service'
import hooks from '../../hooks/common.js'

export default function (app) {
  const { secretKey, tva55, tva20 } = app.get('Stripe')

  // Initialize our service with any options it requires
  app.use('/api/payment', new Service(secretKey, tva55, tva20))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/payment')
  service.hooks(hooks)
}
