import { HealthCheck } from '../healthcheck/healthcheck'
import { HealthCheckExecutorFactory } from './executor/executor'
import { INotificationProcessor } from '../realtime/notification.processor'
import { NotificationType } from '../realtime/notification'
import processorLogger from '../../config/processor.logger'
import { ITimeSeriesDataSource } from '../data/timeseries/timeseries.datasource'

export interface IHealthCheckProcessor {
  init(healthChecks: HealthCheck[]): Promise<void>
}

export class HealthCheckProcessor implements IHealthCheckProcessor {
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
        processorLogger.debug(`Executing HealthCheckProcessor: ${healthCheck.id}`)
        const result = await executor.execute()
        processorLogger.debug(`Execution complete HealthCheckProcessor: ${healthCheck.id}`)

        this.timeSeriesDataSource.writePoint({
          id: healthCheck.id,
          name: healthCheck.name,
          type: 'healthcheck',
          properties: {
            result: result.ok ? result.value : false
          }
        })

        const message = {
          healthCheckId: healthCheck.id,
          result: result
        }
        this.notificationService.notify(NotificationType.HEALTH_CHECK, message)
      }, healthCheck.interval)
    }
  }
}
