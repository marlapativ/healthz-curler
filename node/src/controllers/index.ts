import { Application } from 'express'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'
import { configRouter } from './config.controller'

const apiRoutes = (server: Application) => {
  server.use('/api/v1/healthcheck', healthCheckRouter)
  server.use('/api/v1/healthgraph', healthGraphRouter)
  server.use('/api/v1/config', configRouter)
  return server
}

export { apiRoutes }
