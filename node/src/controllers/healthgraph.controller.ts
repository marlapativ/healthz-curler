import Elysia, { error } from 'elysia'
import { IHealthGraphService } from '../services/healthcheck/healthgraph.service'

type HealthGraphRequest = {
  params: {
    id?: string
  }
  query: {
    page?: number
    pageSize?: number
  }
  healthGraphService: IHealthGraphService
}

const getById = async ({ params: { id }, query: { page, pageSize }, healthGraphService }: HealthGraphRequest) => {
  page = page || 1
  pageSize = pageSize || 100
  const result = await healthGraphService.get(id!, page, pageSize)
  if (result.ok) return result.value
  return error(400, result.error)
}

const healthGraphRouter = (server: Elysia<'/api/v1/healthgraph', false, Context>) => {
  return server
    .derive(({ store: { container } }) => ({
      healthGraphService: container.get<IHealthGraphService>('IHealthGraphService')
    }))
    .get('/:id', getById)
}

export { healthGraphRouter }
