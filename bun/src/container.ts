import { IDataSource, dataSourceFactory } from './services/data/datasource/datasource'
import { InfluxDBDataSource } from './services/data/time/influx.db'
import { ITimeSeriesDataSource, timeSeriesDataSourceFactory } from './services/data/time/timeseries.datasource'
import { HealthCheckService, IHealthCheckService } from './services/healthcheck/healthcheck.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './services/processor/healthcheck.processor'
import { INotificationExecutor } from './services/realtime/executor/notification.executor'
import { SocketNotificationExecutor } from './services/realtime/executor/socket.executor'
import { INotificationProcessor, NotificationProcessor } from './services/realtime/notification.processor'

class Container implements IContainer {
  private map: Map<string, any> = new Map()

  async init() {
    this.buildServices()
    await this.initServices()
  }

  buildServices() {
    this.map.set('IDataSource', dataSourceFactory.get())
    this.map.set('ITimeSeriesDataSource', timeSeriesDataSourceFactory.get())

    this.map.set('INotificationExecutor', [new SocketNotificationExecutor()])
    this.map.set(
      'INotificationProcessor',
      new NotificationProcessor(this.get<INotificationExecutor[]>('INotificationExecutor'))
    )
    this.map.set(
      'IHealthCheckProcessor',
      new HealthCheckProcessor(
        this.get<ITimeSeriesDataSource>('ITimeSeriesDataSource'),
        this.get<INotificationProcessor>('INotificationProcessor')
      )
    )
    this.map.set(
      'IHealthCheckService',
      new HealthCheckService(
        this.get<IDataSource>('IDataSource'),
        this.get<IHealthCheckProcessor>('IHealthCheckProcessor')
      )
    )
  }

  async initServices() {
    const healthCheckService = this.get<IHealthCheckService>('IHealthCheckService')
    await healthCheckService.init()
  }

  get<T>(key: string): T {
    return this.map.get(key)
  }
}

const container: IContainer = new Container()
export { container }
