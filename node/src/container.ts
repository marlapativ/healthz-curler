import { IDataSource, dataSourceFactory } from './services/data/datasource/datasource'
import { ITimeSeriesDataSource, timeSeriesDataSourceFactory } from './services/data/timeseries/timeseries.datasource'
import { HealthCheckService, IHealthCheckService } from './services/healthcheck/healthcheck.service'
import { HealthGraphService, IHealthGraphService } from './services/healthcheck/healthgraph.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './services/processor/healthcheck.processor'
import {
  IWebSocketPublisher,
  IWebSocketMessageHandler,
  WebSocketPublisherService
} from './services/socket/socket.publisher'
import { INotificationExecutor } from './services/realtime/executor/notification.executor'
import { SocketNotificationExecutor } from './services/realtime/executor/socket.executor'
import { INotificationProcessor, NotificationProcessor } from './services/realtime/notification.processor'

class Container implements IContainer {
  private map: Map<string, unknown> = new Map()

  async init() {
    this.buildServices()
    await this.initServices()
  }

  buildServices() {
    this.insert<IDataSource>('IDataSource', dataSourceFactory.get())
    this.insert<ITimeSeriesDataSource>('ITimeSeriesDataSource', timeSeriesDataSourceFactory.get())

    const pubSubService = new WebSocketPublisherService()
    this.insert<IWebSocketPublisher>('IWebSocketPublisher', pubSubService)
    this.insert<IWebSocketMessageHandler>('IWebSocketMessageHandler', pubSubService)
    this.insert<INotificationExecutor>('INotificationExecutor', [
      new SocketNotificationExecutor(this.get<IWebSocketPublisher>('IWebSocketPublisher'))
    ])
    this.insert<INotificationProcessor>(
      'INotificationProcessor',
      new NotificationProcessor(this.get<INotificationExecutor[]>('INotificationExecutor'))
    )
    this.insert<IHealthCheckProcessor>(
      'IHealthCheckProcessor',
      new HealthCheckProcessor(
        this.get<ITimeSeriesDataSource>('ITimeSeriesDataSource'),
        this.get<INotificationProcessor>('INotificationProcessor')
      )
    )
    this.insert<IHealthCheckService>(
      'IHealthCheckService',
      new HealthCheckService(
        this.get<IDataSource>('IDataSource'),
        this.get<IHealthCheckProcessor>('IHealthCheckProcessor')
      )
    )
    this.insert<IHealthGraphService>(
      'IHealthGraphService',
      new HealthGraphService(
        this.get<ITimeSeriesDataSource>('ITimeSeriesDataSource'),
        this.get<IHealthCheckService>('IHealthCheckService')
      )
    )
  }

  async initServices() {
    const healthCheckService = this.get<IHealthCheckService>('IHealthCheckService')
    await healthCheckService.init()
  }

  private insert<T>(key: string, value: T | T[]) {
    this.map.set(key, value)
  }

  get<T>(key: string): T {
    return this.map.get(key) as T
  }
}

const container: IContainer = new Container()
export { container }
