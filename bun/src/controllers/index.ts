import Elysia from 'elysia'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'
import { configRouter } from './config.controller'

const apiRouter = () => {
  const server = new Elysia<'/api/v1', false, Context>({ prefix: '/api/v1' })
    .use(configRouter())
    .use(healthCheckRouter())
    .use(healthGraphRouter())
  return server
}

export { apiRouter }
