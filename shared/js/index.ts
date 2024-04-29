import { env } from './src/utils/env.util'
import { IDataSource, dataSourceFactory } from './src/services/data/datasource/datasource'
import {
  ITimeSeriesDataSource,
  timeSeriesDataSourceFactory
} from './src/services/data/timeseries/timeseries.datasource'
import { HealthCheckService, IHealthCheckService } from './src/services/healthcheck/healthcheck.service'
import { HealthGraphService, IHealthGraphService } from './src/services/healthcheck/healthgraph.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './src/services/processor/healthcheck.processor'
import { ISocketPublisher, ISocketMessageHandler } from './src/services/socket/socket.publisher'
import { INotificationExecutor } from './src/services/realtime/executor/notification.executor'
import { SocketNotificationExecutor } from './src/services/realtime/executor/socket.executor'
import { INotificationProcessor, NotificationProcessor } from './src/services/realtime/notification.processor'
import { SocketIOPublisherService } from './src/services/socket/socketio.publisher'
import { Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io'

export { env }
export { IDataSource, dataSourceFactory }
export { ITimeSeriesDataSource, timeSeriesDataSourceFactory }

export { HealthCheck, HealthCheckStatus, HealthCheckExecutorType } from './src/services/healthcheck/healthcheck'
export { HealthCheckService, IHealthCheckService }

export { HealthGraphService, IHealthGraphService }
export { HealthCheckProcessor, IHealthCheckProcessor }

export { WebSocketMessageType, WebSocketMessage } from './src/services/socket/socket.publisher'
export { SocketNotificationExecutor, INotificationExecutor }
export { NotificationProcessor, INotificationProcessor }
export { ISocketPublisher, ISocketMessageHandler }

type ISocketIOMessageHandler = ISocketMessageHandler<SocketIOSocket, SocketIOServer>
export { SocketIOPublisherService, ISocketIOMessageHandler }

export { Logger } from './src/config/logger'
export { IQueryableTimeParams } from './src/services/data/timeseries/timeseries.datasource'

export { Model } from './src/types/model'
export { Result, ResultOk, ResultError } from './src/types/result'
export { Ok, Exception, HttpStatusError } from './src/utils/result.util'
