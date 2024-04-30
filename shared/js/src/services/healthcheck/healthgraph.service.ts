import { Result } from '../../types/result'
import { Ok } from '../../utils/result.util'
import {
  IQueryableTimeParams,
  IQueryableTimeSeriesData,
  ITimeSeriesDataSource
} from '../data/timeseries/timeseries.datasource'
import { IHealthCheckService } from './healthcheck.service'

export interface IHealthGraphService {
  get(healthCheckId: string, queryTimeParams?: IQueryableTimeParams): Promise<Result<any[], Error>>
}

export class HealthGraphService implements IHealthGraphService {
  timeSeriesDataSource: ITimeSeriesDataSource
  healthCheckService: IHealthCheckService

  constructor(timeSeriesDataSource: ITimeSeriesDataSource, healthCheckService: IHealthCheckService) {
    this.timeSeriesDataSource = timeSeriesDataSource
    this.healthCheckService = healthCheckService
  }

  async get(healthCheckId: string, queryTimeParams?: IQueryableTimeParams): Promise<Result<any[], Error>> {
    const healthCheckResult = await this.healthCheckService.get(healthCheckId)
    if (!healthCheckResult.ok) return healthCheckResult
    const healthCheck = healthCheckResult.value
    let endDate = new Date()
    if (queryTimeParams?.endTime) endDate = new Date(queryTimeParams.endTime)
    let startDate = new Date()
    startDate.setHours(startDate.getHours() - 3)
    if (queryTimeParams?.startTime) startDate = new Date(queryTimeParams.startTime)
    const query: IQueryableTimeSeriesData = {
      id: healthCheck.id,
      name: healthCheck.name,
      type: 'HealthCheck',
      startTime: startDate,
      endTime: endDate,
      page: queryTimeParams?.page ?? 1,
      pageSize: queryTimeParams?.pageSize ?? 100,
      properties: {
        result: ''
      }
    }
    const results = await this.timeSeriesDataSource.queryData(query)
    return Ok(results)
  }
}
