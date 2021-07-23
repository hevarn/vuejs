import Service from './service'
import hooks from './hooks'

export default function (app) {
  const { secretKey } = app.get('Stripe')

  // Initialize our service with any options it requires
  app.use('/api/couponsStripe', new Service(secretKey))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/couponsStripe')
  service.hooks(hooks)
}
