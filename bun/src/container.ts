import { IDataSource, dataSourceFactory } from './services/data/datasource/datasource'
import { ITimeSeriesDataSource, timeSeriesDataSourceFactory } from './services/data/timeseries/timeseries.datasource'
import { HealthCheckService, IHealthCheckService } from './services/healthcheck/healthcheck.service'
import { HealthGraphService, IHealthGraphService } from './services/healthcheck/healthgraph.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './services/processor/healthcheck.processor'
import { ISocketPublisher, ISocketMessageHandler } from './services/socket/socket.publisher'
import { INotificationExecutor } from './services/realtime/executor/notification.executor'
import { SocketNotificationExecutor } from './services/realtime/executor/socket.executor'
import { INotificationProcessor, NotificationProcessor } from './services/realtime/notification.processor'
import { WebSocketPublisherService } from './services/socket/websocket.publisher'
import { Server, ServerWebSocket } from 'bun'
import { SockerIOPublisherService } from './services/socket/socketio.publisher'
import { Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io'

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
    const socketIOPublisher = new SockerIOPublisherService()
    this.insert<ISocketPublisher[]>('ISocketPublisher', [websocketPublisher, socketIOPublisher])
    this.insert<ISocketMessageHandler<ServerWebSocket, Server>>(
      'ISocketMessageHandler<ServerWebSocket, Server>',
      websocketPublisher
    )
    this.insert<ISocketMessageHandler<SocketIOSocket, SocketIOServer>>(
      'ISocketMessageHandler<SocketIOSocket, SocketIOServer>',
      socketIOPublisher
    )
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
