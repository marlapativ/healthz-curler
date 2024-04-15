import { dataSourceFactory, IDataSource } from '../data/datasource'

export enum HealthCheckStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded'
}

export enum HealthCheckExecutor {
  DEFAULT = 'default',
  CURL = 'curl'
}

export type HealthCheck = {
  id: string
  name: string
  url: string
  status: HealthCheckStatus
  auth?: {
    username: string
    password: string
    apiKey: string
  }
  executor?: HealthCheckExecutor
}

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
}

const dataSource = dataSourceFactory.get()
const healthCheckService: IHealthCheckService = new HealthCheckService(dataSource)
export default healthCheckService
