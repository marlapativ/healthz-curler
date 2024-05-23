import { Result } from '../../../types/result'
import { HealthCheck, HealthCheckExecutorType } from '../../healthcheck/healthcheck'

export type HealthCheckExecutionResult = {
  result: boolean
  errorMessage?: string
  timestamp: Date
}

export interface IHealthCheckExecutor {
  execute(): Promise<Result<HealthCheckExecutionResult, Error>>
}

class HealthCheckExecutorFactoryHandler {
  private executors: Map<HealthCheckExecutorType, IHealthCheckExecutor> = new Map<
    HealthCheckExecutorType,
    IHealthCheckExecutor
  >()

  register(type: HealthCheckExecutorType, executor: IHealthCheckExecutor) {
    this.executors.set(type, executor)
  }

  get(healthCheck: HealthCheck): IHealthCheckExecutor {
    const executorType = healthCheck.executor ?? 'default'
    const executor = this.executors.get(executorType)
    if (!executor) {
      throw new Error(`Executor not found for type: ${executorType}`)
    }
    return executor
  }

  getExecutors(): HealthCheckExecutorType[] {
    return Array.from(this.executors.keys())
  }
}

const HealthCheckExecutorFactory = new HealthCheckExecutorFactoryHandler()
export { HealthCheckExecutorFactory }
