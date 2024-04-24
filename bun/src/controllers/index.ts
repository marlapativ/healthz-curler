import Elysia from 'elysia'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'
import { configRouter } from './config.controller'

const routes = (server: Elysia<'/api/v1', false, Context>) => {
  return server
    .group('/healthcheck', healthCheckRouter)
    .group('/healthgraph', healthGraphRouter)
    .group('/config', configRouter)
}

const apiRoutes = (server: Elysia<'', false, Context>) => {
  return server.group('/api/v1', (api) => routes(api))
}

export { apiRoutes }
