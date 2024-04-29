import Elysia, { Static, t } from 'elysia'
import { HttpStatusError, Ok, Result } from 'healthz-curler-shared-js'
import { IHealthCheckService } from 'healthz-curler-shared-js'
import { HealthCheckExecutorType } from 'healthz-curler-shared-js'

type HealthCheckIdRequest = {
  params: { id: string }
  healthCheckService: IHealthCheckService
}

type HealthCheckBodyRequest = HealthCheckIdRequest & {
  body: Static<typeof tHealthCheck>
}

const tHealthCheck = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  url: t.String(),
  interval: t.Number(),
  method: t.Optional(t.String()),
  expectedResponseCode: t.Optional(t.Number()),
  timeout: t.Optional(t.Number()),
  active: t.Optional(t.Boolean()),
  auth: t.Optional(
    t.Object({
      username: t.String(),
      password: t.String(),
      apiKey: t.String()
    })
  ),
  executor: t.Optional(t.Enum(HealthCheckExecutorType))
})

const getAll = async ({ healthCheckService }: HealthCheckIdRequest) => {
  const result = await healthCheckService.getAll()
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error.message)
}

const getById = async ({ params: { id }, healthCheckService }: HealthCheckIdRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) throw new HttpStatusError(400, validationResult.error.message)

  const result = await healthCheckService.get(id!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error.message)
}

const create = async ({ body, healthCheckService }: HealthCheckBodyRequest) => {
  const result = await healthCheckService.create(body!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error.message)
}

const updateById = async ({ params: { id }, body, healthCheckService }: HealthCheckBodyRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) validationResult.error

  const result = await healthCheckService.update(id!, body!)
  if (result.ok) return result.value
  else throw result.error
}

const deleteById = async ({ params: { id }, healthCheckService }: HealthCheckIdRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) throw new HttpStatusError(400, validationResult.error.message)

  const result = await healthCheckService.delete(id!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error.message)
}

const validateRequest = (id: string | undefined): Result<boolean, Error> => {
  if (!id) return new HttpStatusError(400, 'Id is required')
  return Ok(true)
}

const healthCheckRouter = () => {
  const healthcheckServer = new Elysia<'healthcheck', false, Context>({
    prefix: 'healthcheck',
    tags: ['healthcheck']
  })
    .derive(({ store: { container } }) => ({
      healthCheckService: container.get<IHealthCheckService>('IHealthCheckService')
    }))
    .get('/', getAll, {
      type: 'application/json',
      response: t.Array(tHealthCheck),
      detail: {
        summary: 'Get all health checks',
        description: 'Returns a list of all health checks'
      }
    })
    .post('/', create, {
      type: 'application/json',
      body: tHealthCheck,
      response: tHealthCheck,
      detail: {
        summary: 'Create a health check',
        description: 'Creates a new health check'
      }
    })
    .get('/:id', getById, {
      type: 'application/json',
      params: t.Object({
        id: t.String()
      }),
      response: tHealthCheck,
      detail: {
        summary: 'Get a health check by id',
        description: 'Returns a health check by id'
      }
    })
    .put('/:id', updateById, {
      type: 'application/json',
      params: t.Object({
        id: t.String()
      }),
      body: tHealthCheck,
      response: tHealthCheck,
      detail: {
        summary: 'Update a health check by id',
        description: 'Updates a health check by id'
      }
    })
    .delete('/:id', deleteById, {
      type: 'application/json',
      params: t.Object({
        id: t.String()
      }),
      response: tHealthCheck,
      detail: {
        summary: 'Delete a health check by id',
        description: 'Deletes a health check by id'
      }
    })

  return healthcheckServer
}

export { healthCheckRouter }
