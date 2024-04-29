import { Application } from 'express'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'
import { configRouter } from './config.controller'
import { healthzRouter } from './healthz.controller'

const routes = (server: Application) => {
  server.use('/healthz', healthzRouter)
  server.use('/api/v1/healthcheck', healthCheckRouter)
  server.use('/api/v1/healthgraph', healthGraphRouter)
  server.use('/api/v1/config', configRouter)
  return server
}

export { routes }
