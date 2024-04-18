import env from '../../../utils/env.util'
import { ITimeSeriesData, ITimeSeriesDataSource } from './timeseries.datasource'

export class PostgresDBDataSource implements ITimeSeriesDataSource {
  constructor() {}

  async writePoint(point: ITimeSeriesData): Promise<void> {}
}
