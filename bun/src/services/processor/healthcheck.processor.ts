import { IDataSource } from '../data/datasource/datasource'
import { HealthCheck } from '../healthcheck/healthcheck'
import { HealthCheckExecutorFactory } from './executor/executor'
import { INotificationProcessor } from '../realtime/notification.processor'
import { NotificationType } from '../realtime/notification'
import processorLogger from '../../config/processor.logger'

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
    for (const healthCheck of healthChecks) {
      const executor = HealthCheckExecutorFactory.get(healthCheck)
      this.timeouts[healthCheck.id] = setInterval(async () => {
        processorLogger.debug(`Executing HealthCheckProcessor: ${healthCheck.id}`)
        const result = await executor.execute()
        processorLogger.debug(`Execution complete HealthCheckProcessor: ${healthCheck.id}`)

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
