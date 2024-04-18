import { InfluxDB, Point, QueryApi, WriteApi } from '@influxdata/influxdb-client'
import env from '../../../utils/env.util'
import { ITimeSeriesData, ITimeSeriesDataSource } from './timeseries.datasource'

export class InfluxDBDataSource implements ITimeSeriesDataSource {
  private _influxDb: InfluxDB
  private writeApi: WriteApi
  private queryApi: QueryApi

  constructor() {
    const token = env.getOrDefault('INFLUX_TOKEN', '')
    const bucket = env.getOrDefault('INFLUX_BUCKET', 'healthz-curler')
    const org = env.getOrDefault('INFLUX_ORG', 'healthz-curler')
    if (!token) throw new Error('InfluxDB token is required')
    if (!bucket || !org) throw new Error('InfluxDB bucket and organization are required')

    this._influxDb = new InfluxDB({
      url: env.getOrDefault('INFLUX_URL', 'http://localhost:8086'),
      token
    })
    this.writeApi = this._influxDb.getWriteApi(org, bucket, undefined, { flushInterval: 5000 })
    this.writeApi.useDefaultTags({ implementation: 'bun', language: 'js' })
    this.queryApi = this._influxDb.getQueryApi(org)
  }

  async writePoint(point: ITimeSeriesData): Promise<void> {
    const timestamp = point.timestamp ? point.timestamp : new Date()
    let pointToWrite = new Point(point.name).timestamp(timestamp).tag('id', point.id).tag('type', point.type)
    for (const [key, value] of Object.entries(point.properties)) {
      if (typeof value === 'number') pointToWrite = pointToWrite.floatField(key, value)
      else if (typeof value === 'boolean') pointToWrite = pointToWrite.booleanField(key, value)
      else pointToWrite = pointToWrite.stringField(key, value)
    }
    this.writeApi.writePoint(pointToWrite)
  }
}
