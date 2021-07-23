// Initializes the `mailer` service on path `/mailer`
import hooks from '../../hooks/open-hooks'
import Service from './service'

export default function (app) {
  const { email, name, apiKey } = app.get('mailerConf')
  // Initialize our service with any options it requires
  app.use('/api/mailer', new Service(email, name, apiKey))

  // Get our initialized service so that we can register hooks

  const service = app.service('/api/mailer')
  service.hooks(hooks)
}
