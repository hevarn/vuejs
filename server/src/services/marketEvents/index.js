import createService from 'feathers-sequelize'
import createModel from '../../models/marketEvents.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate,
    multi: ['create', 'patch']
  }

  // Initialize our service with any options it requires
  app.use('/api/marketEvents', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/marketEvents')

  service.hooks(hooks)
}
