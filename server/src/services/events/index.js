// Initializes the `users` service on path `/users`
import createService from 'feathers-sequelize'
import createModel from '../../models/evenement.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = { default: 10000, max: 20000 }

  const options = {
    Model,
    paginate,
    multi: ['remove', 'create']
  }

  // Initialize our service with any options it requires
  app.use('/api/events', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/events')

  service.hooks(hooks)
}
