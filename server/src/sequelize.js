import Sequelize from 'sequelize'
import mysql2 from 'mysql2'
import logger from './logger'

export default async function (app) {
  const { host, database, username, password } = app.get('mysql')
  function getTimeZone () {
    let timezone = '+02:00'
    const spring = new Date(new Date().getFullYear(), 3, -0, 3)
    const autumn = new Date(new Date().getFullYear(), 10, -0, 3)
    spring.setDate(spring.getDate() - spring.getDay())
    autumn.setDate(autumn.getDate() - autumn.getDay())
    if (new Date() > spring && new Date() < autumn) {
      timezone = '+01:00'
    }
    return timezone
  }

  const sequelize = new Sequelize(host, {
    database,
    username,
    password,
    dialect: 'mysql',
    dialectModule: mysql2,
    dialectOptions: {
      connectTimeout: 60000
    },
    timezone: getTimeZone(),
    logging: false,
    define: {
      freezeTableName: true
    },
    pool: {
      max: 15,
      min: 1,
      acquire: 120000,
      idle: 120000
    },
    retry: {
      backoffBase: 1000,
      backoffExponent: 1.5,
      report: (msg) => {
        if (!msg.includes('#1')) {
          logger.info(`query timeout, retrying ${msg}`)
        }
      },
      max: 5, // maximum amount of tries
      timeout: 30000, // throw if no response or error within millisecond timeout, default: undefined,
      match: [ // Must match error signature (ala bluebird catch) to continue
        Sequelize.ConnectionError,
        Sequelize.ConnectionTimedOutError
      ]
    }
  })
  const oldSetup = app.setup
  app.set('sequelizeClient', sequelize)

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args)

    // Set up data relationships
    const models = sequelize.models
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models)
      }
    })
    // Sync to the database
    if (process.env.NODE_ENV !== 'production') {
      sequelize.sync()
    }
    return result
  }
  if (process.env.NODE_ENV !== 'production') {
    try {
      await sequelize.authenticate()
      sequelize.sync()
      logger.info('Connection to DB has been established successfully.')
    } catch (error) {
      logger.error('Unable to connect to the database:', error)
    }
  }
}
