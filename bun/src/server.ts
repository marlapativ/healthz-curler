import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import logger from './config/logger'
import { dataSourceFactory } from './services/data/datasource'
import env from './utils/env.utils'
import { routes } from './controllers'

const SERVER_PORT = env.getOrDefault('SERVER_PORT', '4205')

const executeServer = () => {
  const server = new Elysia()
    .use(cors())
    .use(swagger())
    .group('/api', (apiRoute) => apiRoute.group('/v1', (v1Route) => v1Route.use(routes)))

  return server
}

const server = await dataSourceFactory
  .get()
  .init()
  .then(() => {
    logger.info('Data source initialized')
    const server = executeServer().listen(SERVER_PORT, () => {
      logger.info(`Server running on port ${SERVER_PORT}`)
    })
    return server
  })

export { server }
