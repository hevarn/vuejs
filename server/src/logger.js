import pino from 'pino'
const options = {}
if (process.env.NODE_ENV !== 'production') {
  options.prettyPrint = {
    translateTime: true,
    colorize: true
  }
}
export default pino(options)
