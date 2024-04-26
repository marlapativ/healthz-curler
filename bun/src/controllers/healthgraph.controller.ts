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

const healthGraphRouter = () => {
  const server = new Elysia<'healthgraph', false, Context>({
    prefix: 'healthgraph',
    tags: ['healthgraph']
  })
    .derive(({ store: { container } }) => ({
      healthGraphService: container.get<IHealthGraphService>('IHealthGraphService')
    }))
    .get('/:id', getById)
  return server
}

export { healthGraphRouter }
