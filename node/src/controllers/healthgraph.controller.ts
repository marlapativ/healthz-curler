import express, { Request, Response } from 'express'
import { IHealthGraphService } from '../services/healthcheck/healthgraph.service'

const getById = async ({ params: { id }, query: { page, pageSize }, container }: Request, res: Response) => {
  const healthGraphService = container.get<IHealthGraphService>('IHealthGraphService')
  const pageNo = page === undefined ? 1 : parseInt(page as string)
  const pageSizeValue = pageSize === undefined ? 100 : parseInt(pageSize as string)
  const result = await healthGraphService.get(id!, pageNo, pageSizeValue)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(500).json(result.error)
}

const healthGraphRouter = express.Router()
healthGraphRouter.get('/:id', getById)

export { healthGraphRouter }
