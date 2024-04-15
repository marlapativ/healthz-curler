import { dataSourceFactory, IDataSource } from '../data/datasource'
import { HealthCheck } from './healthcheck'

export interface IHealthCheckService {
  getAll(): Promise<Result<Array<HealthCheck>, Error>>
}

class HealthCheckService implements IHealthCheckService {
  dataSourceService: IDataSource
  keyPrefix: string

  constructor(dataSourceService: IDataSource) {
    this.keyPrefix = 'healthcheck:'
    this.dataSourceService = dataSourceService
  }

  async getAll(): Promise<Result<Array<HealthCheck>, Error>> {
    const result = await this.dataSourceService.getAll<HealthCheck>(`${this.keyPrefix}*`)
    return result
  }

  async get(id: string): Promise<Result<HealthCheck, Error>> {
    const result = await this.dataSourceService.get<HealthCheck>(`${this.keyPrefix}:${id}`)
    return result
  }

  async create(healthCheck: HealthCheck): Promise<Result<HealthCheck, Error>> {
    const result = await this.dataSourceService.set<HealthCheck>(`${this.keyPrefix}:${healthCheck.id}`, healthCheck)
    return result
  }
}

const dataSource = dataSourceFactory.get()
const healthCheckService: IHealthCheckService = new HealthCheckService(dataSource)
export default healthCheckService
