import { Application } from 'express'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'

const routes = (server: Application) => {
  return server.use('/healthcheck', healthCheckRouter).use('/healthgraph', healthGraphRouter)
}

const apiRoutes = (server: Application) => {
  return server.use('/api/v1', routes)
}

export { apiRoutes }
