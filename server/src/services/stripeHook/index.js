import Service from './service'

export default function (app) {
  const { secretKey } = app.get('Stripe')

  // Initialize our service with any options it requires
  app.use('/api/stripeHook', new Service(secretKey))
}
