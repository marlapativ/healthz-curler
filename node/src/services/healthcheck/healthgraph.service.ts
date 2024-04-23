import { Ok } from '../../utils/result.util'
import { IQueryableTimeSeriesData, ITimeSeriesDataSource } from '../data/timeseries/timeseries.datasource'
import { IHealthCheckService } from './healthcheck.service'

export interface IHealthGraphService {
  get(healthCheckId: string, page?: number, pageSize?: number): Promise<Result<unknown[], Error>>
}

export class HealthGraphService implements IHealthGraphService {
  timeSeriesDataSource: ITimeSeriesDataSource
  healthCheckService: IHealthCheckService

  constructor(timeSeriesDataSource: ITimeSeriesDataSource, healthCheckService: IHealthCheckService) {
    this.timeSeriesDataSource = timeSeriesDataSource
    this.healthCheckService = healthCheckService
  }

  async get(healthCheckId: string, page?: number, pageSize?: number): Promise<Result<unknown[], Error>> {
    const healthCheckResult = await this.healthCheckService.get(healthCheckId)
    if (!healthCheckResult.ok) return healthCheckResult
    const healthCheck = healthCheckResult.value
    const endDate = new Date()
    const startDate = new Date()
    startDate.setHours(startDate.getHours() - 3)
    const query: IQueryableTimeSeriesData = {
      id: healthCheck.id,
      name: healthCheck.name,
      type: 'HealthCheck',
      startTime: startDate,
      endTime: endDate,
      page: page || 1,
      pageSize: pageSize || 100,
      properties: {}
    }
    const results = await this.timeSeriesDataSource.queryData(query)
    return Ok(results)
  }
}
