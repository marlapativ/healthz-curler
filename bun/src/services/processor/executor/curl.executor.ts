import processorLogger from '../../../config/processor.logger'
import { Ok } from '../../../utils/result.util'
import { HealthCheck } from '../../healthcheck/healthcheck'
import { IHealthCheckExecutor } from './executor'

export class CurlExecutor implements IHealthCheckExecutor {
  private healthCheck: HealthCheck

  constructor(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck
  }

  async execute(): Promise<Result<boolean, Error>> {
    processorLogger.info(`Executing 'Curl' executor for ${this.healthCheck.id} - ${this.healthCheck.name}`)
    return Ok(true)
  }
}
