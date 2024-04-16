import { IDataSource } from '../data/datasource'
import { HealthCheck } from '../healthcheck/healthcheck'
import { HealthCheckExecutorFactory } from './executor/executor'
import { INotificationProcessor } from '../realtime/notification.processor'
import logger from '../../config/logger'
import { NotificationType } from '../realtime/notification'

export interface IHealthCheckProcessor {
  init(healthChecks: HealthCheck[]): Promise<void>
}

export class HealthCheckProcessor implements IHealthCheckProcessor {
  dataSource: IDataSource
  timeouts: Record<string, Timer> = {}
  notificationService: INotificationProcessor

  constructor(dataSource: IDataSource, notificationService: INotificationProcessor) {
    this.dataSource = dataSource
    this.notificationService = notificationService
  }

  async init(healthChecks: HealthCheck[]): Promise<void> {
    console.log('HealthCheckProcessor process. Start the set timeouts.')
    for (const healthCheck of healthChecks) {
      const executor = HealthCheckExecutorFactory.get(healthCheck)
      this.timeouts[healthCheck.id] = setInterval(async () => {
        logger.info(`Executing HealthCheckProcessor: ${healthCheck.id} - Start`)
        const result = await executor.execute()
        logger.info(`HealthCheckProcessor: ${healthCheck.id} - ${result}`)

        // TODO: Update the result to database

        const message = {
          healthCheckId: healthCheck.id,
          result: result
        }
        this.notificationService.notify(NotificationType.HEALTH_CHECK, message)
      }, healthCheck.interval)
    }
  }
}
