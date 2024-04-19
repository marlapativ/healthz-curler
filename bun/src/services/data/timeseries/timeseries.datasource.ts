import logger from '../../../config/logger'
import env from '../../../utils/env.util'
import { InfluxDBDataSource } from './influx.timeseries'

export interface ITimeSeriesDataSource {
  writePoint(point: ITimeSeriesData): Promise<void>
  queryData<T>(request: IQueryableTimeSeriesData): Promise<T[]>
}

export interface IQueryableTimeSeriesData extends ITimeSeriesData {
  startTime: Date
  endTime: Date
  pageSize?: number
  page?: number
}

export interface ITimeSeriesData {
  id: string
  name: string
  type: string
  timestamp?: Date
  properties: Record<string, number | string | boolean>
}

let timeSeriesDataSource: ITimeSeriesDataSource

const timeSeriesDataSourceFactory = {
  get: (): ITimeSeriesDataSource => {
    if (timeSeriesDataSource) return timeSeriesDataSource
    const dataSourceType = env.getOrDefault('TIMESERIES_DATA_SOURCE', 'influx')
    logger.info(`Creating new time series data source. Type: ${dataSourceType}`)
    switch (dataSourceType) {
      case 'influx':
      default:
        timeSeriesDataSource = new InfluxDBDataSource()
    }
    return timeSeriesDataSource
  }
}
export { timeSeriesDataSourceFactory }
