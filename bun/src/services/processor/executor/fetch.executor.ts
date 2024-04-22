import { random } from 'lodash'
import { Ok } from '../../../utils/result.util'
import { HealthCheck } from '../../healthcheck/healthcheck'
import { IHealthCheckExecutor } from './executor'
import Logger from '../../../config/logger'
const logger = Logger(import.meta.file)

export class FetchExecutor implements IHealthCheckExecutor {
  private healthCheck: HealthCheck

  constructor(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck
  }

  async execute(): Promise<Result<boolean, Error>> {
    logger.info(`Executing 'Fetch' executor for ${this.healthCheck.id} - ${this.healthCheck.name}`)
    return Ok(random(0, 1) == 0)
  }
}
