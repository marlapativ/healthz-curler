import { Ok } from '../../../utils/result.util'
import { HealthCheck, withDefaults } from '../../healthcheck/healthcheck'
import { HealthCheckExecutionResult, IHealthCheckExecutor } from './executor'
import Logger from '../../../config/logger'
import { Result } from '../../../types/result'
const logger = Logger(__filename)

export class FetchExecutor implements IHealthCheckExecutor {
  private healthCheck: HealthCheck

  constructor(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck
  }

  async execute(): Promise<Result<HealthCheckExecutionResult, Error>> {
    logger.info(`Executing 'Fetch' executor for ${this.healthCheck.id} - ${this.healthCheck.name}`)

    const defaultedHealthCheck = withDefaults(this.healthCheck)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), defaultedHealthCheck.timeout)
    try {
      const response = await fetch(defaultedHealthCheck.url, {
        method: defaultedHealthCheck.method,
        signal: controller.signal
      })
      const result = response.status === defaultedHealthCheck.expectedResponseCode
      return Ok({
        result,
        errorMessage: response.statusText,
        timestamp: new Date()
      })
    } catch (error) {
      logger.error(`Failed to fetch data for ${this.healthCheck.id} - ${this.healthCheck.name}`, error)
      return Ok({
        result: false,
        errorMessage: 'Failed to fetch data. Error: ' + (error as Error).message,
        timestamp: new Date()
      })
    } finally {
      clearTimeout(timeoutId)
    }
  }
}
