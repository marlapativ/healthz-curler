import {
  FetchExecutor,
  HealthCheckExecutorFactory,
  IDataSource,
  ISocketIOMessageHandler,
  dataSourceFactory
} from 'healthz-curler-shared-js'
import { ITimeSeriesDataSource, timeSeriesDataSourceFactory } from 'healthz-curler-shared-js'
import { HealthCheckService, IHealthCheckService } from 'healthz-curler-shared-js'
import { HealthGraphService, IHealthGraphService } from 'healthz-curler-shared-js'
import { HealthCheckProcessor, IHealthCheckProcessor } from 'healthz-curler-shared-js'
import { ISocketPublisher } from 'healthz-curler-shared-js'
import { INotificationExecutor } from 'healthz-curler-shared-js'
import { SocketNotificationExecutor } from 'healthz-curler-shared-js'
import { INotificationProcessor, NotificationProcessor } from 'healthz-curler-shared-js'
import { SocketIOPublisherService } from 'healthz-curler-shared-js'
import { IWebSocketMessageHandler, WebSocketPublisherService } from './services/socket/websocket.publisher'
import { CurlExecutor } from './services/processor/executor/curl.executor'

class Container implements IContainer {
  private map: Map<string, unknown> = new Map()

  async init() {
    this.buildServices()
    await this.initServices()
  }

  buildServices() {
    this.insert<IDataSource>('IDataSource', dataSourceFactory.get())
    this.insert<ITimeSeriesDataSource>('ITimeSeriesDataSource', timeSeriesDataSourceFactory.get())

    const socketIOPublisher = new SocketIOPublisherService()
    const webSocketPublisher = new WebSocketPublisherService()
    this.insert<ISocketPublisher[]>('ISocketPublisher', [socketIOPublisher, webSocketPublisher])
    this.insert<ISocketIOMessageHandler>('ISocketIOMessageHandler', socketIOPublisher)
    this.insert<IWebSocketMessageHandler>('IWebSocketMessageHandler', webSocketPublisher)
    this.insert<INotificationExecutor>('INotificationExecutor', [
      new SocketNotificationExecutor(this.get<ISocketPublisher[]>('ISocketPublisher'))
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
    HealthCheckExecutorFactory.register('default', new FetchExecutor())
    HealthCheckExecutorFactory.register('fetch', new FetchExecutor())
    HealthCheckExecutorFactory.register('curl', new CurlExecutor())
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
