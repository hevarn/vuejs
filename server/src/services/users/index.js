// Initializes the `users` service on path `/users`
import createService from 'feathers-sequelize'
import createModel from '../../models/users.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)

  const options = {
    Model
  }

  // Initialize our service with any options it requires
  app.use('/api/users', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/users')

  service.hooks(hooks)
}
