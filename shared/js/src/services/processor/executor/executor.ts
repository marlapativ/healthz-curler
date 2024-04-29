import { Result } from '../../../types/result'
import { HealthCheck, HealthCheckExecutorType } from '../../healthcheck/healthcheck'
import { CurlExecutor } from './curl.executor'
import { FetchExecutor } from './fetch.executor'

export type HealthCheckExecutionResult = {
  result: boolean
  errorMessage?: string
  timestamp: Date
}

export interface IHealthCheckExecutor {
  execute(): Promise<Result<HealthCheckExecutionResult, Error>>
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
