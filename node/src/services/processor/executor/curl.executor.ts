import { Ok, Result } from 'healthz-curler-shared-js'
import { HealthCheck } from 'healthz-curler-shared-js'
import { HealthCheckExecutionResult, IHealthCheckExecutor } from 'healthz-curler-shared-js'
import { Logger } from 'healthz-curler-shared-js'
const logger = Logger(__filename)

export class CurlExecutor implements IHealthCheckExecutor {
  private healthCheck!: HealthCheck

  create(healthCheck: HealthCheck): IHealthCheckExecutor {
    const executor = new CurlExecutor()
    executor.healthCheck = healthCheck
    return executor
  }

  async execute(): Promise<Result<HealthCheckExecutionResult, Error>> {
    logger.info(`Executing 'Curl' executor for ${this.healthCheck.id} - ${this.healthCheck.name}`)
    return Ok({
      result: true,
      timestamp: new Date()
    })
  }
}
