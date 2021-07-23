import logger from './logger'
import app from './ap$p'
const port = app.get('port')

process.on('unhandledRejection', (reason, p) =>
  logger.error(`'Unhandled Rejection at: Promise ${p + reason}`)
)

function listen (server, https = false) {
  server.on('listening', () => logger.info(`started on ${https ? 'https' : 'http'}://${app.get('host')}:${port}`))
}

const server = app.listen(port)
listen(server)
