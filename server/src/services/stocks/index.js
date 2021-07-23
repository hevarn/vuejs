// Initializes the `users` service on path `/users`
import createService from 'feathers-sequelize'
import createModel from '../../models/stocks.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate,
    multi: ['create']
  }

  // Initialize our service with any options it requires
  app.use('/api/stocks', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/stocks')

  service.hooks(hooks)
}
