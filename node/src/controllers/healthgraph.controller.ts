import express, { Request, Response } from 'express'
import { IHealthGraphService, IQueryableTimeParams } from 'healthz-curler-shared-js'

const getById = async ({ params: { id }, query, container }: Request, res: Response) => {
  const params: IQueryableTimeParams = query
  const healthGraphService = container.get<IHealthGraphService>('IHealthGraphService')
  const result = await healthGraphService.get(id!, params)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(500).json(result.error)
}

const healthGraphRouter = express.Router()
healthGraphRouter.get('/:id', getById)

export { healthGraphRouter }
