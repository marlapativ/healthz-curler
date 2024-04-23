import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'

const routes = (server: Elysia<'/api/v1', false, Context>) => {
  return server.group('/healthcheck', healthCheckRouter).group('/healthgraph', healthGraphRouter)
}

const apiRoutes = (server: Express.Application) => {
  return server.group('/api/v1', (api) => routes(api))
}

export { apiRoutes }
