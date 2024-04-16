import { Ok } from '../../../utils/result.util'
import { HealthCheck } from '../../healthcheck/healthcheck'
import { IHealthCheckExecutor } from './executor'

export class CurlExecutor implements IHealthCheckExecutor {
  private healthCheck: HealthCheck

  constructor(healthCheck: HealthCheck) {
    this.healthCheck = healthCheck
  }

  async execute(): Promise<Result<boolean, Error>> {
    console.log('Curl executor')
    return Ok(true)
  }
}
