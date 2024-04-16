import { Container } from 'inversify'
import { HealthCheckService, IHealthCheckService } from './services/healthcheck/healthcheck.service'
import { INotificationService, NotificationService } from './services/realtime/notification.service'
import { HealthCheckProcessor, IHealthCheckProcessor } from './services/processor/healthcheck.processor'
import { IDataSource } from './services/data/datasource'
import { InMemoryDataSource } from './services/data/inmemory.datasource'

const container = new Container()

container.bind<IDataSource>(InMemoryDataSource).toSelf().inSingletonScope()
container.bind<IHealthCheckProcessor>(HealthCheckProcessor).toSelf().inSingletonScope()
container.bind<IHealthCheckService>(HealthCheckService).toSelf().inSingletonScope()
container.bind<INotificationService>(NotificationService).toSelf().inSingletonScope()
