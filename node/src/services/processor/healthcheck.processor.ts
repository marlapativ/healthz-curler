import { HealthCheck } from '../healthcheck/healthcheck'
import { HealthCheckExecutionResult, HealthCheckExecutorFactory } from './executor/executor'
import { Notification, INotificationProcessor } from '../realtime/notification.processor'
import { NotificationType } from '../realtime/notification'
import { ITimeSeriesDataSource } from '../data/timeseries/timeseries.datasource'
import { IProcessor } from './processor'
import Logger from '../../config/logger'
const logger = Logger(import.meta.file)

export interface IHealthCheckProcessor extends IProcessor {
  init(healthChecks: HealthCheck[]): Promise<void>
}

export class HealthCheckProcessor implements IHealthCheckProcessor {
  type: string = 'HealthCheck'
  timeSeriesDataSource: ITimeSeriesDataSource
  timeouts: Record<string, Timer> = {}
  notificationService: INotificationProcessor

  constructor(timeSeriesDataSource: ITimeSeriesDataSource, notificationService: INotificationProcessor) {
    this.timeSeriesDataSource = timeSeriesDataSource
    this.notificationService = notificationService
  }

  async init(healthChecks: HealthCheck[]): Promise<void> {
    for (const healthCheck of healthChecks) {
      const executor = HealthCheckExecutorFactory.get(healthCheck)
      this.timeouts[healthCheck.id] = setInterval(async () => {
        logger.debug(`Executing HealthCheckProcessor: ${healthCheck.id}`)
        const executionResult = await executor.execute()
        logger.debug(`Execution complete HealthCheckProcessor: ${healthCheck.id}`)

        const result: HealthCheckExecutionResult = executionResult.ok
          ? executionResult.value
          : {
              result: false,
              errorMessage: executionResult.error.message,
              timestamp: new Date()
            }

        this.timeSeriesDataSource.writePoint({
          id: healthCheck.id,
          name: healthCheck.name,
          type: this.type,
          properties: result
        })

        const message: Notification<HealthCheckExecutionResult> = {
          id: healthCheck.id,
          message: result
        }
        this.notificationService.notify(NotificationType.HealthCheck, message)
      }, healthCheck.interval)
    }
  }
}
