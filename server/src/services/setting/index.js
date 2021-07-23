import Service from './service'
import hooks from '../../hooks/open-hooks'

export default function (app) {
  app.use('/api/setting', new Service())

  // Get our initialized service so that we can register hooks
  const service = app.service('/api/setting')

  service.hooks(hooks)
}
