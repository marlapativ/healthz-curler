import { HealthCheck } from '../services/healthcheck/healthcheck'
import { Ok } from '../utils/result.util'
import { IHealthCheckService } from '../services/healthcheck/healthcheck.service'

type HealthCheckRequest = {
  params: {
    id?: string
  }
  body: HealthCheck
  healthCheckService: IHealthCheckService
}

const getAll = async ({ healthCheckService }: HealthCheckRequest) => {
  const result = await healthCheckService.getAll()
  if (result.ok) return result.value
  return error(400, result.error)
}

const getById = async ({ params: { id }, healthCheckService }: HealthCheckRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return error(400, validationResult.error)

  const result = await healthCheckService.get(id!)
  if (result.ok) return result.value
  return error(400, result.error)
}

const create = async ({ body, healthCheckService }: HealthCheckRequest) => {
  const result = await healthCheckService.create(body)
  if (result.ok) return result.value
  return error(400, result.error)
}

const updateById = async ({ params: { id }, body, healthCheckService }: HealthCheckRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return error(400, validationResult.error)

  const result = await healthCheckService.update(id!, body)
  if (result.ok) return result.value
  return error(400, result.error)
}

const deleteById = async ({ params: { id }, healthCheckService }: HealthCheckRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return error(400, validationResult.error)

  const result = await healthCheckService.delete(id!)
  if (result.ok) return result.value
  return error(400, result.error)
}

const validateRequest = (id: string | undefined): Result<boolean, Error> => {
  if (!id) return new Error('Id is required')
  return Ok(true)
}

const healthCheckRouter = (server: Elysia<'/api/v1/healthcheck', false, Context>) => {
  return server
    .derive(({ store: { container } }) => ({
      healthCheckService: container.get<IHealthCheckService>('IHealthCheckService')
    }))
    .get('/', getAll)
    .post('/', create)
    .get('/:id', getById)
    .put('/:id', updateById)
    .delete('/:id', deleteById)
}

export { healthCheckRouter }
