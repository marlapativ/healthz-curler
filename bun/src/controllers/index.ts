import Elysia from 'elysia'
import { healthCheckRouter } from './healthcheck.controller'

const routes = (server: Elysia<'/api/v1'>) => {
  return server.group('/healthcheck', healthCheckRouter)
}
export { routes }
