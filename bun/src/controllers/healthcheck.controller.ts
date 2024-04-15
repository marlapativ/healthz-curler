import Elysia, { error } from 'elysia'
import healthCheckService from '../services/healthcheck/healthcheck.service'

type HealthCheckRequest = {
  params: {
    id?: string
  }
}

const create = () => {
  return 'Create Hello World'
}

const getAll = async () => {
  const result = await healthCheckService.getAll()
  if (result.ok) return result.value
  return error(400, result.error)
}

const getById = ({ params: { id } }: HealthCheckRequest) => {
  return `Hello World ${id}`
}

const updateById = ({ params: { id } }: HealthCheckRequest) => {
  return `Update Hello World ${id}`
}

const deleteById = ({ params: { id } }: HealthCheckRequest) => {
  return `Delete Hello World - ${id}`
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
