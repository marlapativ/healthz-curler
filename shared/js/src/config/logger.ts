import winston from 'winston'
import { env } from '../utils/env.util'

const { combine, timestamp, printf, align } = winston.format
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5
}

const logFormat = printf((data) => {
  const { namespace, level, message, timestamp } = data
  return `[${timestamp}] [${namespace}] ${level}: ${message}`
})

const logFolder = env.getOrDefault('LOG_FOLDER', './logs')
const logFileName = env.getOrDefault('LOG_FILE_NAME', 'server.log')
const defaultLogLevel = env.getOrDefault('LOG_LEVEL', 'info')

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ filename: `${logFolder}/${logFileName}`, level: defaultLogLevel })
]

const logger = winston.createLogger({
  levels: logLevels,
  level: defaultLogLevel,
  format: combine(timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), align(), logFormat),
  transports: transports
})

export const Logger = (namespace?: string) => {
  if (namespace) {
    if (namespace.indexOf('/') > -1) namespace = namespace.split('/').pop()
    return logger.child({ namespace })
  }
  return logger
}

export default Logger
