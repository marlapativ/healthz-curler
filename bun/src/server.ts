import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import logger from './config/logger'
import env from './utils/env.util'
import { dataSourceFactory } from './services/data/datasource/datasource'
import { apiRoutes } from './controllers'
import { seedDatabase } from './seed/seed.data'
import { container } from './container'
import { IWebSocketMessageHandler } from './services/socket/socket.pubsub'

const SERVER_PORT = env.getOrDefault('SERVER_PORT', '4205')

const startServer = () => {
  const socketMessageHandler = container.get<IWebSocketMessageHandler>('IWebSocketMessageHandler')
  const server = new Elysia()
    .use(cors())
    .use(swagger())
    .state('container', container)
    .use(apiRoutes)
    .ws('/ws', {
      message: socketMessageHandler.message
    })
    .listen(SERVER_PORT, ({ hostname, port }) => {
      logger.info(`Server running on port ${port}`)
      logger.info(`Swagger: http://${hostname}:${port}/swagger`)
    })
  return server
}

const server = Promise.resolve()
  .then(async () => {
    logger.info('Initializing data source')
    const dataSource = dataSourceFactory.get()
    const result = await dataSource.init()
    logger.info('Data source initialized')
    return result
  })
  .then(async (db) => {
    logger.info('Seeding database')
    const seedResult = await seedDatabase(db)
    logger.info(`Database seed status: ${seedResult}`)
  })
  .then(async () => {
    logger.info('Initializing container')
    await container.init()
    logger.info('Container initialized')
  })
  .then(() => {
    return startServer()
  })
  .catch((error) => {
    logger.error('Error initializing database/server', error)
    process.exit(1)
  })

export { server }
