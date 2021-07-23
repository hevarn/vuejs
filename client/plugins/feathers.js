import app from '@/api'
import feathersVuex, { initAuth } from 'feathers-vuex'

// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } = feathersVuex(
  app,
  {
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    idField: '_id', // Must match the id field in your database table/collection
    whitelist: ['$regex', '$options'],
    enableEvents: process.client // No events for SSR server
  }
)

export { makeAuthPlugin, makeServicePlugin, initAuth, BaseModel, models, FeathersVuex }
export default app
