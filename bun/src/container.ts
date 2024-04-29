import { IDataSource, dataSourceFactory } from 'healthz-curler-shared-js'
import { ITimeSeriesDataSource, timeSeriesDataSourceFactory } from 'healthz-curler-shared-js'
import { HealthCheckService, IHealthCheckService } from 'healthz-curler-shared-js'
import { HealthGraphService, IHealthGraphService } from 'healthz-curler-shared-js'
import { HealthCheckProcessor, IHealthCheckProcessor } from 'healthz-curler-shared-js'
import { ISocketPublisher, ISocketMessageHandler } from 'healthz-curler-shared-js'
import { INotificationExecutor } from 'healthz-curler-shared-js'
import { SocketNotificationExecutor } from 'healthz-curler-shared-js'
import { INotificationProcessor, NotificationProcessor } from 'healthz-curler-shared-js'
import { SocketIOPublisherService, ISocketIOMessageHandler } from 'healthz-curler-shared-js'
import { WebSocketPublisherService } from './services/socket/websocket.publisher'
import { Server, ServerWebSocket } from 'bun'

class Container implements IContainer {
  private map: Map<string, any> = new Map()

  async init() {
    this.buildServices()
    await this.initServices()
  }

  buildServices() {
    this.insert<IDataSource>('IDataSource', dataSourceFactory.get())
    this.insert<ITimeSeriesDataSource>('ITimeSeriesDataSource', timeSeriesDataSourceFactory.get())

    const websocketPublisher = new WebSocketPublisherService()
    const socketIOPublisher = new SocketIOPublisherService()
    this.insert<ISocketPublisher[]>('ISocketPublisher', [websocketPublisher, socketIOPublisher])
    this.insert<ISocketMessageHandler<ServerWebSocket, Server>>(
      'ISocketMessageHandler<ServerWebSocket, Server>',
      websocketPublisher
    )
    this.insert<ISocketIOMessageHandler>('ISocketIOMessageHandler', socketIOPublisher)
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
    const healthCheckService = this.get<IHealthCheckService>('IHealthCheckService')
    await healthCheckService.init()
  }

  private insert<T>(key: string, value: T | T[]) {
    if (this.map.has(key)) {
      throw new Error(`Key ${key} already exists in the container`)
    }
    this.map.set(key, value)
  }

  get<T>(key: string): T {
    return this.map.get(key)
  }
}

const container: IContainer = new Container()
export { container }
