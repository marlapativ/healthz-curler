import { InfluxDB, Point, QueryApi, WriteApi } from '@influxdata/influxdb-client'
import env from '../../../utils/env.util'
import { IQueryableTimeSeriesData, ITimeSeriesData, ITimeSeriesDataSource } from './timeseries.datasource'
import Logger from '../../../config/logger'
const logger = Logger(__filename)

export class InfluxDBDataSource implements ITimeSeriesDataSource {
  private bucket: string
  private _influxDb: InfluxDB
  private writeApi: WriteApi
  private queryApi: QueryApi
  private implementation: string = env.getRuntime()

  constructor() {
    const token = env.getOrDefault('INFLUX_TOKEN', '')
    this.bucket = env.getOrDefault('INFLUX_BUCKET', 'healthz-curler')
    const org = env.getOrDefault('INFLUX_ORG', 'healthz-curler')
    if (!token) throw new Error('InfluxDB token is required')
    if (!this.bucket || !org) throw new Error('InfluxDB bucket and organization are required')

    this._influxDb = new InfluxDB({
      url: env.getOrDefault('INFLUX_URL', 'http://localhost:8086'),
      token
    })
    this.writeApi = this._influxDb.getWriteApi(org, this.bucket, undefined, { flushInterval: 5000 })
    this.writeApi.useDefaultTags({ implementation: this.implementation, language: 'js' })
    this.queryApi = this._influxDb.getQueryApi(org)
  }

  async writePoint(point: ITimeSeriesData): Promise<void> {
    logger.info(`Writing point to InfluxDB: ${point.id}`)
    const timestamp = point.timestamp ? point.timestamp : new Date()
    let pointToWrite = new Point(point.name).timestamp(timestamp).tag('id', point.id).tag('type', point.type)
    for (const [key, value] of Object.entries(point.properties)) {
      if (typeof value === 'number') pointToWrite = pointToWrite.floatField(key, value)
      else if (typeof value === 'boolean') pointToWrite = pointToWrite.booleanField(key, value)
      else pointToWrite = pointToWrite.stringField(key, value)
    }
    this.writeApi.writePoint(pointToWrite)
  }

  async queryData<T>(request: IQueryableTimeSeriesData): Promise<T[]> {
    const page = request.page ? request.page : 1
    const pageSize = request.pageSize ? request.pageSize : 100
    const queryProperties = Object.keys(request.properties).map(
      (key) => `|> filter(fn: (r) => r["_field"] == "${key}")`
    )
    const startTime = Math.floor(request.startTime!.getTime() / 1000)
    const endTime = Math.ceil(request.endTime!.getTime() / 1000)
    const query = `from(bucket: "${this.bucket}")
      |> range(start: ${startTime}, stop: ${endTime})
      |> filter(fn: (r) => r["implementation"] == "${this.implementation}")
      |> filter(fn: (r) => r["language"] == "js")
      |> filter(fn: (r) => r["_measurement"] == "${request.name}")
      |> filter(fn: (r) => r["id"] == "${request.id}")
      |> filter(fn: (r) => r["type"] == "${request.type}")
      ${queryProperties}
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: ${pageSize}, offset: ${(page - 1) * pageSize})`
    const result = []
    for await (const { values, tableMeta } of this.queryApi.iterateRows(query)) {
      const record = tableMeta.toObject(values) as T
      result.push(record)
    }
    return result
  }
}
