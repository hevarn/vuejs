// Initializes the `users` service on path `/users`
import createService from 'feathers-sequelize'
import createModel from '../../models/countries.model'
import hooks from '../../hooks/common'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/api/countries', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/countries')

  service.hooks(hooks)
}
