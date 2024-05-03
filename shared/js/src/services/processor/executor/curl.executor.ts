import random from 'lodash.random'
import { Ok } from '../../../utils/result.util'
import { HealthCheck } from '../../healthcheck/healthcheck'
import { HealthCheckExecutionResult, IHealthCheckExecutor } from './executor'
import Logger from '../../../config/logger'
import { Result } from '../../../types/result'
const logger = Logger(__filename)

export class CurlExecutor implements IHealthCheckExecutor {
  private healthCheck: HealthCheck

  constructor(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck
  }

  async execute(): Promise<Result<HealthCheckExecutionResult, Error>> {
    logger.info(`Executing 'Curl' executor for ${this.healthCheck.id} - ${this.healthCheck.name}`)
    const isSuccess = random(0, 1) == 0
    const response: HealthCheckExecutionResult = {
      result: isSuccess,
      errorMessage: isSuccess ? undefined : 'Failed to fetch data',
      timestamp: new Date()
    }
    return Ok(response)
  }
}
