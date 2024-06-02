import { HealthCheck } from '../healthcheck/healthcheck'
import { ITimeSeriesDataSource } from '../data/timeseries/timeseries.datasource'
import { IProcessor } from './processor'
import { INotificationProcessor } from '../realtime/notification.processor'

export interface IHealthCheckProcessor extends IProcessor {
  init(healthChecks: HealthCheck[]): Promise<void>
  add(healthCheck: HealthCheck): Promise<void>
  update(healthCheck: HealthCheck): Promise<void>
  delete(healthCheck: HealthCheck): Promise<void>
}

export class HealthCheckProcessor implements IHealthCheckProcessor {
  type: string = 'HealthCheck'
  timeSeriesDataSource: ITimeSeriesDataSource
  timeouts: Record<string, any> = {}
  notificationService: INotificationProcessor

  constructor(timeSeriesDataSource: ITimeSeriesDataSource, notificationService: INotificationProcessor) {
    this.timeSeriesDataSource = timeSeriesDataSource
    this.notificationService = notificationService
  }

  async add(healthCheck: HealthCheck): Promise<void> {
    return this.init([healthCheck])
  }

  async update(healthCheck: HealthCheck): Promise<void> {
    await this.delete(healthCheck)
    return this.add(healthCheck)
  }

  async delete(healthCheck: HealthCheck): Promise<void> {
    clearInterval(this.timeouts[healthCheck.id])
    delete this.timeouts[healthCheck.id]
  }

  async init(healthChecks: HealthCheck[]): Promise<void> {
    healthChecks = healthChecks.filter((hc) => hc.active)
    return
  }
}
