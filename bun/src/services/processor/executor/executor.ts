import { HealthCheck, HealthCheckExecutorType } from '../../healthcheck/healthcheck'
import { CurlExecutor } from './curl.executor'
import { FetchExecutor } from './fetch.executor'

export interface IHealthCheckExecutor {
  execute(): Promise<Result<boolean, Error>>
}

const HealthCheckExecutorFactory = {
  get(healthCheck: HealthCheck): IHealthCheckExecutor {
    switch (healthCheck.executor) {
      case HealthCheckExecutorType.CURL:
        return new CurlExecutor(healthCheck)
      case HealthCheckExecutorType.FETCH:
      default:
        return new FetchExecutor(healthCheck)
    }
  }
}

export { HealthCheckExecutorFactory }
