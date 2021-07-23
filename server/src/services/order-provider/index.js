import createService from 'feathers-sequelize'
import createModel from '../../models/orderProvider.model'
import hooks from './hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate,
    multi: ['patch', 'remove']
  }

  // Initialize our service with any options it requires
  app.use('/api/order-provider', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/order-provider')

  service.hooks(hooks)
}
