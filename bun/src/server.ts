import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import logger from './config/logger'
import { dataSourceFactory } from './services/data/datasource'
import env from './utils/env.util'
import { routes } from './controllers'
import { seedDatabase } from './seed/seed.data'

const SERVER_PORT = env.getOrDefault('SERVER_PORT', '4205')

const startServer = () => {
  const server = new Elysia()
    .use(cors())
    .use(swagger())
    .group('/api/v1', (api) => api.use(routes))
    .listen(SERVER_PORT, ({ hostname, port }) => {
      logger.info(`Server running on port ${port}`)
      logger.info(`Swagger: http://${hostname}:${port}/swagger`)
    })
  return server
}

const server = await dataSourceFactory
  .get()
  .init()
  .then(async (db) => {
    logger.info('Data source initialized')
    const seedResult = await seedDatabase(db)
    logger.info(`Database seed status: ${seedResult}`)
  })
  .then(() => {
    return startServer()
  })
  .catch((error) => {
    logger.error('Error initializing data source/Setting up server', error)
    process.exit(1)
  })

export { server }
