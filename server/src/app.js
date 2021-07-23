import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import logger from './logger'
import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import services from './services'
import appHooks from './app.hooks'
import sequelize from './sequelize'
import qs from 'qs'

logger.debug('initializing all middleware chain')
const app = express(feathers())

// setting for multi bulk over than 20 queries
app.set('query parser', str => qs.parse(str, { arrayLimit: 1000 }))
// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
// Temporary solution for large pictures until good compression
app.use(express.json())
// Set up Plugins and providers
app.configure(express.rest())
app.configure(sequelize)

// Set up our services (see `services/index.js`)
app.configure(services)

// Configure a middleware for 404s and the error handler
app.use(express.notFound({ verbose: true }))
app.use(express.errorHandler({ logger, html: false }))

app.hooks(appHooks)
logger.debug('initialized all middleware chain')

export default app
