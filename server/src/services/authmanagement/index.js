import authManagement from 'feathers-authentication-management'
import hooks from '../../hooks/open-hooks'
import notifier from './notifier'

export default function (app) {
  // Initialize our service with any options it requires
  app.configure(authManagement(notifier(app), { delay: 1000 * 60 * 60 * 24 }))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('/api/authManagement')

  service.hooks(hooks)
}
