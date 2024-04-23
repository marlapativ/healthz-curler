import { Application, Request, Response } from 'express'
import { IHealthCheckService } from '../services/healthcheck/healthcheck.service'
import { Ok } from '../utils/result.util'

const getHealthCheckService = ({ container }: Request) => container.get<IHealthCheckService>('IHealthCheckService')

const getAll = async (req: Request, res: Response) => {
  const healthCheckService = getHealthCheckService(req)
  const result = await healthCheckService.getAll()
  if (result.ok) return res.status(200).json(result.value)
  return res.status(400).json(result.error)
}

const getById = async (req: Request, res: Response) => {
  const { id } = req.params
  const healthCheckService = getHealthCheckService(req)
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return res.status(400).json(validationResult.error)

  const result = await healthCheckService.get(id!)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(500).json(result.error)
}

const create = async (req: Request, res: Response) => {
  const healthCheckService = getHealthCheckService(req)
  const result = await healthCheckService.create(req.body)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(500).json(result.error)
}

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params
  const healthCheckService = getHealthCheckService(req)
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return res.status(400).json(validationResult.error)

  const result = await healthCheckService.update(id!, req.body)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(500).json(result.error)
}

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params
  const healthCheckService = getHealthCheckService(req)
  const validationResult = validateRequest(id)
  if (!validationResult.ok) return res.status(400).json(validationResult.error)

  const result = await healthCheckService.delete(id!)
  if (result.ok) return res.status(200).json(result.value)
  return res.status(500).json(result.error)
}

const validateRequest = (id: string | undefined): Result<boolean, Error> => {
  if (!id) return new Error('Id is required')
  return Ok(true)
}

const healthCheckRouter = (server: Application) => {
  return server
    .get('/', getAll)
    .post('/', create)
    .get('/:id', getById)
    .put('/:id', updateById)
    .delete('/:id', deleteById)
}

export { healthCheckRouter }
