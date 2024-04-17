import Elysia from 'elysia'
import { healthCheckRouter } from './healthcheck.controller'

const routes = (server: Elysia<'/api/v1', false, Context>) => {
  return server.group('/healthcheck', healthCheckRouter)
}

const apiRoutes = (server: Elysia<'', false, Context>) => {
  return server.group('/api/v1', (api) => routes(api))
}

export { apiRoutes }
