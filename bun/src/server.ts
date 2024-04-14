import logger from './config/logger'
import { dataSourceFactory } from './services/data/datasource'
import env from './utils/env.utils'
import { Elysia } from 'elysia'

const executeServer = () => {
  const port = env.getOrDefault('PORT', '4201')
  const server = new Elysia()

  server.get('/', () => 'Hello Elysia')
  server.listen(3000, () => {
    logger.info(`Server running on port ${port}`)
  })

  return server
}

const server = await dataSourceFactory
  .get()
  .init()
  .then(() => {
    logger.info('Data source initialized')
    return executeServer()
  })

export default server
