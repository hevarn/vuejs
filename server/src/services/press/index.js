// Initializes the `users` service on path `/users`
import createService from 'feathers-sequelize'
import createModel from '../../models/press.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/api/press', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/press')

  service.hooks(hooks)
}
