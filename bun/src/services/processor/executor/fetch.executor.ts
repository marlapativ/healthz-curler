import { random } from 'lodash'
import processorLogger from '../../../config/processor.logger'
import { Ok } from '../../../utils/result.util'
import { HealthCheck } from '../../healthcheck/healthcheck'
import { IHealthCheckExecutor } from './executor'

export class FetchExecutor implements IHealthCheckExecutor {
  private healthCheck: HealthCheck

  constructor(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck
  }

  async execute(): Promise<Result<boolean, Error>> {
    processorLogger.info(`Executing 'Fetch' executor for ${this.healthCheck.id} - ${this.healthCheck.name}`)
    return Ok(random(0, 1) == 0)
  }
}
