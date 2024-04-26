import { IDataSource, dataSourceFactory } from './services/data/datasource/datasource'
import { ITimeSeriesDataSource, timeSeriesDataSourceFactory } from './services/data/timeseries/timeseries.datasource'
import { HealthCheckService, IHealthCheckService } from './services/healthcheck/healthcheck.service'
import { HealthGraphService, IHealthGraphService } from './services/healthcheck/healthgraph.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './services/processor/healthcheck.processor'
import { ISocketPublisher, ISocketMessageHandler } from './services/socket/socket.publisher'
import { INotificationExecutor } from './services/realtime/executor/notification.executor'
import { SocketNotificationExecutor } from './services/realtime/executor/socket.executor'
import { INotificationProcessor, NotificationProcessor } from './services/realtime/notification.processor'
import { SocketIOPublisherService } from './services/socket/socketio.publisher'
import { WebSocketPublisherService } from './services/socket/websocket.publisher'
import { Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io'
import { WebSocket, WebSocketServer } from 'ws'
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
    this.insert<ISocketMessageHandler<SocketIOSocket, SocketIOServer>>(
      'ISocketMessageHandler<SocketIOSocket, SocketIOServer>',
      socketIOPublisher
    )
    this.insert<ISocketMessageHandler<WebSocket, WebSocketServer>>(
      'ISocketMessageHandler<WebSocket, WebSocketServer>',
      webSocketPublisher
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
    this.map.set(key, value)
  }

  get<T>(key: string): T {
    return this.map.get(key) as T
  }
}

const container: IContainer = new Container()
export { container }
