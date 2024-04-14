import logger from './config/logger'
import { dataSourceFactory } from './services/data/datasource'
import env from './utils/env.utils'

const bunServer = () => {
  const port = env.getOrDefault('PORT', '4201')

  const server = Bun.serve({
    port,
    fetch(req) {
      console.log(req.url)
      return new Response('Bun!')
    }
  })

  logger.info(`Server running on port ${port}`)
  return server
}

const server = await dataSourceFactory
  .get()
  .init()
  .then(() => {
    logger.info('Data source initialized')
    return bunServer()
  })

export default server
