import Elysia from 'elysia'
import { healthCheckRouter } from './healthcheck.controller'
import { healthGraphRouter } from './healthgraph.controller'
import { configRouter } from './config.controller'
import { HttpStatusError } from 'healthz-curler-shared-js'
import { healthzRouter } from './healthz.controller'

const router = () => {
  return new Elysia().use(healthzRouter())
}

const apiRouter = () => {
  const server = new Elysia<'/api/v1', false, Context>({ prefix: '/api/v1' })
    .use(configRouter())
    .use(healthCheckRouter())
    .use(healthGraphRouter())
    .onError((response) => {
      const errorResponse = {
        error: ['Internal Server Error']
      }
      if (response.error instanceof HttpStatusError) {
        response.set.status = response.error.statusCode
        errorResponse.error = [response.error.msg].flat()
      } else {
        response.set.status = 500
        errorResponse.error = [response.error.message].flat()
      }
      return errorResponse
    })
  return server
}

export { router, apiRouter }
