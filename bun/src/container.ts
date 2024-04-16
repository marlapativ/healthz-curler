import { IDataSource, dataSourceFactory } from './services/data/datasource'
import { HealthCheckService, IHealthCheckService } from './services/healthcheck/healthcheck.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './services/processor/healthcheck.processor'
import { ConsoleNotificationExecutor } from './services/realtime/executor/console.executor'
import { INotificationExecutor } from './services/realtime/executor/notification.executor'
import { SocketNotificationExecutor } from './services/realtime/executor/socket.executor'
import { INotificationProcessor, NotificationProcessor } from './services/realtime/notification.processor'

const notificationExecutors: INotificationExecutor[] = [
  new ConsoleNotificationExecutor(),
  new SocketNotificationExecutor()
]
const dataSource: IDataSource = dataSourceFactory.get()
const notificationProcessor: INotificationProcessor = new NotificationProcessor(notificationExecutors)
const healthCheckProcessor: IHealthCheckProcessor = new HealthCheckProcessor(dataSource, notificationProcessor)
const healthCheckService: IHealthCheckService = new HealthCheckService(dataSource, healthCheckProcessor)

export { healthCheckService }
