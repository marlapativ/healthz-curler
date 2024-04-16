import { Ok } from '../../utils/result.util'
import { dataSourceFactory, IDataSource } from '../data/datasource'
import { healthCheckProcessorFactory, IHealthCheckProcessor } from '../processor/healthcheck.processor'
import { HealthCheck } from './healthcheck'

export interface IHealthCheckService {
  getAll(): Promise<Result<Array<HealthCheck>, Error>>
  get(id: string): Promise<Result<HealthCheck, Error>>
  create(healthCheck: HealthCheck): Promise<Result<HealthCheck, Error>>
  update(id: string, healthCheck: HealthCheck): Promise<Result<HealthCheck, Error>>
  delete(id: string): Promise<Result<HealthCheck, Error>>
}

export class HealthCheckService implements IHealthCheckService {
  dataSource: IDataSource
  keyPrefix: string
  healthCheckProcessor: IHealthCheckProcessor

  constructor(dataSourceService: IDataSource, healthCheckProcessor: IHealthCheckProcessor) {
    this.keyPrefix = 'healthcheck'
    this.dataSource = dataSourceService
    this.healthCheckProcessor = healthCheckProcessor
  }

  private async getKey(id: string): Promise<string> {
    return `${this.keyPrefix}:${id}`
  }

  async getAll(): Promise<Result<Array<HealthCheck>, Error>> {
    const result = await this.dataSource.getAll<HealthCheck>(`${this.getKey('*')}`)
    return result
  }

  async get(id: string): Promise<Result<HealthCheck, Error>> {
    const result = await this.dataSource.get<HealthCheck>(`${this.getKey(id)}`)
    return result
  }

  async create(healthCheck: HealthCheck): Promise<Result<HealthCheck, Error>> {
    const validationResult = this.validate(healthCheck)
    if (!validationResult.ok) return validationResult

    const uuid = crypto.randomUUID()
    const result = await this.dataSource.set<HealthCheck>(`${this.getKey(uuid)}`, healthCheck)
    return result
  }

  async update(id: string, healthCheck: HealthCheck): Promise<Result<HealthCheck, Error>> {
    healthCheck.id = id
    const validationResult = this.validate(healthCheck, false)
    if (!validationResult.ok) return validationResult

    const exists = await this.dataSource.has(healthCheck.id)
    if (!exists.ok) return new Error('Error retrieving healthcheck')
    if (!exists.value) return new Error('HealthCheck does not exist')

    const result = await this.dataSource.set<HealthCheck>(`${this.getKey(healthCheck.id)}`, healthCheck)
    return result
  }

  async delete(id: string): Promise<Result<HealthCheck, Error>> {
    const data = await this.dataSource.get<HealthCheck>(id)
    if (!data.ok) return data

    const result = await this.dataSource.delete(`${this.getKey(id)}`)
    if (!result.ok) return result
    return data
  }

  validate(healthCheck: HealthCheck, isCreate: boolean = true): Result<HealthCheck, Error> {
    if (!healthCheck) return new Error('HealthCheck is required')
    if (isCreate) {
      if (healthCheck.id) return new Error('HealthCheck id cannot be passed')
    } else {
      if (!healthCheck.id) return new Error('HealthCheck id is required')
    }
    if (!healthCheck.name) return new Error('HealthCheck name is required')
    if (!healthCheck.url) return new Error('HealthCheck url is required')
    return Ok(healthCheck)
  }
}

const dataSource = dataSourceFactory.get()
const healthCheckProcessor = healthCheckProcessorFactory.get(dataSource)
const healthCheckService: IHealthCheckService = new HealthCheckService(dataSource, healthCheckProcessor)
export default healthCheckService
