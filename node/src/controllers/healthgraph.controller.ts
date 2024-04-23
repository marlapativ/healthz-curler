import { Application, Response } from 'express'
import { IHealthGraphService } from '../services/healthcheck/healthgraph.service'
import { Request } from 'express'

const getById = async ({ params: { id }, query: { page, pageSize }, container }: Request, res: Response) => {
  const healthGraphService = container.get<IHealthGraphService>('IHealthGraphService')
  const pageNo = page === undefined ? 1 : parseInt(page as string)
  const pageSizeValue = pageSize === undefined ? 100 : parseInt(pageSize as string)
  const result = await healthGraphService.get(id!, pageNo, pageSizeValue)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(400).json(result.error)
}

const healthGraphRouter = (server: Application) => {
  return server.get('/:id', getById)
}

export { healthGraphRouter }
