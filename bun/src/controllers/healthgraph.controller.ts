import Elysia, { error } from 'elysia'
import { IHealthGraphService } from 'healthz-curler-shared-js'
import { IQueryableTimeParams } from 'healthz-curler-shared-js'

type HealthGraphRequest = {
  params: {
    id?: string
  }
  query: IQueryableTimeParams
  healthGraphService: IHealthGraphService
}

const getById = async ({ params: { id }, query, healthGraphService }: HealthGraphRequest) => {
  const result = await healthGraphService.get(id!, query)
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
