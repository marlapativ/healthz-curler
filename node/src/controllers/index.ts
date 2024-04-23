import { Application } from 'express'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'

const apiRoutes = (server: Application) => {
  server.use('/api/v1/healthcheck', healthCheckRouter)
  server.use('/api/v1/healthgraph', healthGraphRouter)
  return server
}

export { apiRoutes }
