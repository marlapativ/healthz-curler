import Elysia, { error } from 'elysia'
import { HealthCheck } from '../services/healthcheck/healthcheck'
import { Ok } from '../utils/result.util'
import { healthCheckService } from '../container'

type HealthCheckRequest = {
  params: {
    id?: string
  }
  body: HealthCheck
}

const getAll = async () => {
  const result = await healthCheckService.getAll()
  if (result.ok) return result.value
  return error(400, result.error)
}

const getById = async ({ params: { id } }: HealthCheckRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return error(400, validationResult.error)

  const result = await healthCheckService.get(id!)
  if (result.ok) return result.value
  return error(400, result.error)
}

const create = async ({ body }: HealthCheckRequest) => {
  const result = await healthCheckService.create(body)
  if (result.ok) return result.value
  return error(400, result.error)
}

const updateById = async ({ params: { id }, body }: HealthCheckRequest) => {
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return error(400, validationResult.error)

  const result = await healthCheckService.update(id!, body)
  if (result.ok) return result.value
  return error(400, result.error)
}

const deleteById = async ({ params: { id } }: HealthCheckRequest) => {
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

const healthCheckRouter = (server: Elysia<'/api/v1/healthcheck'>) => {
  return server
    .get('/', getAll)
    .post('/', create)
    .get('/:id', getById)
    .put('/:id', updateById)
    .delete('/:id', deleteById)
}

export { healthCheckRouter }
