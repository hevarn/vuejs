// Initializes the `users` service on path `/users`
import createService from 'feathers-sequelize'
import createModel from '../../models/participations.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate,
    multi: ['patch']
  }

  // Initialize our service with any options it requires
  app.use('/api/participations', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/participations')

  service.hooks(hooks)
}
