import logger from '../../../config/logger'
import env from '../../../utils/env.util'
import { InfluxDBDataSource } from './influx.db'

export interface ITimeSeriesDataSource {
  writePoint(point: ITimeSeriesData): Promise<void>
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
