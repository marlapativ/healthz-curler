import Elysia, { Static, t } from 'elysia'
import { Ok } from '../utils/result.util'
import { IHealthCheckService } from '../services/healthcheck/healthcheck.service'
import { HealthCheckExecutorType } from '../services/healthcheck/healthcheck'

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
  throw new HttpStatusError(400, result.error)
}

const getById = async ({ params: { id }, healthCheckService }: HealthCheckIdRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) throw new HttpStatusError(400, validationResult.error)

  const result = await healthCheckService.get(id!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error)
}

const create = async ({ body, healthCheckService }: HealthCheckBodyRequest) => {
  const result = await healthCheckService.create(body!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error)
}

const updateById = async ({ params: { id }, body, healthCheckService }: HealthCheckBodyRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) throw new HttpStatusError(400, validationResult.error)

  const result = await healthCheckService.update(id!, body!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error)
}

const deleteById = async ({ params: { id }, healthCheckService }: HealthCheckIdRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) throw new HttpStatusError(400, validationResult.error)

  const result = await healthCheckService.delete(id!)
  if (result.ok) return result.value
  throw new HttpStatusError(400, result.error)
}

const validateRequest = (id: string | undefined): Result<boolean, Error> => {
  if (!id) return new Error('Id is required')
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
      response: t.Array(tHealthCheck),
      detail: {
        summary: 'Get all health checks',
        description: 'Returns a list of all health checks'
      }
    })
    .post('/', create, {
      body: tHealthCheck,
      response: tHealthCheck,
      detail: {
        summary: 'Create a health check',
        description: 'Creates a new health check'
      }
    })
    .get('/:id', getById, {
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
      detail: {
        summary: 'Update a health check by id',
        description: 'Updates a health check by id'
      }
    })
    .delete('/:id', deleteById, {
      detail: {
        summary: 'Delete a health check by id',
        description: 'Deletes a health check by id'
      }
    })

  return healthcheckServer
}

export { healthCheckRouter }
