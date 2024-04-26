import { IDataSource } from '../data/datasource/datasource'
import { IHealthCheckProcessor } from '../processor/healthcheck.processor'
import { HealthCheck } from './healthcheck'

export interface IHealthCheckService {
  init(): Promise<void>
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

  constructor(dataSource: IDataSource, healthCheckProcessor: IHealthCheckProcessor) {
    this.keyPrefix = 'healthcheck'
    this.dataSource = dataSource
    this.healthCheckProcessor = healthCheckProcessor
  }

  private getKey(id: string): string {
    return `${this.keyPrefix}:${id}`
  }

  async init(): Promise<void> {
    const healthChecks = await this.getAll()
    if (healthChecks.ok) this.healthCheckProcessor.init(healthChecks.value)
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
    if (validationResult.length > 0) return new HttpStatusError(400, validationResult)

    const uuid = crypto.randomUUID()
    healthCheck.id = uuid
    healthCheck.active = true
    const result = await this.dataSource.set<HealthCheck>(`${this.getKey(uuid)}`, healthCheck)
    if (result.ok) this.healthCheckProcessor.add(healthCheck)
    return result
  }

  async update(id: string, healthCheck: HealthCheck): Promise<Result<HealthCheck, Error>> {
    healthCheck.id = id
    const validationResult = this.validate(healthCheck, false)
    if (validationResult.length > 0) return new HttpStatusError(400, validationResult)

    const exists = await this.dataSource.has(healthCheck.id)
    if (!exists.ok) return new Error('Error retrieving healthcheck')
    if (!exists.value) return new Error('HealthCheck does not exist')

    const result = await this.dataSource.set<HealthCheck>(`${this.getKey(healthCheck.id)}`, healthCheck)
    if (result.ok) this.healthCheckProcessor.update(healthCheck)
    return result
  }

  async delete(id: string): Promise<Result<HealthCheck, Error>> {
    const data = await this.dataSource.get<HealthCheck>(id)
    if (!data.ok) return data

    const result = await this.dataSource.delete(`${this.getKey(id)}`)
    if (!result.ok) return result

    this.healthCheckProcessor.delete(data.value)
    return data
  }

  validate(healthCheck: HealthCheck, isCreate: boolean = true): string[] {
    const validationResults = []
    if (!healthCheck) return ['HealthCheck is required']
    if (isCreate) {
      if (healthCheck.id) validationResults.push('HealthCheck id cannot be passed')
    } else {
      if (!healthCheck.id) validationResults.push('HealthCheck id is required')
    }
    if (!healthCheck.name) validationResults.push('HealthCheck name is required')
    if (!healthCheck.url) validationResults.push('HealthCheck url is required')
    if (!healthCheck.interval) validationResults.push('HealthCheck interval is required')
    if (healthCheck.interval < 250) validationResults.push('HealthCheck interval must be greater than 250ms')

    return validationResults
  }
}
