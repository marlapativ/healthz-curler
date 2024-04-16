import { IDataSource } from '../data/datasource'
import { HealthCheck } from '../healthcheck/healthcheck'
import { HealthCheckExecutorFactory } from './executor/executor'

export interface IHealthCheckProcessor {
  init(healthChecks: HealthCheck[]): Promise<void>
}

export class HealthCheckProcessor implements IHealthCheckProcessor {
  dataSource: IDataSource
  timeouts: Record<string, Timer> = {}
  constructor(dataSource: IDataSource) {
    this.dataSource = dataSource
  }

  async init(healthChecks: HealthCheck[]): Promise<void> {
    console.log('HealthCheckProcessor process. Start the set timeouts.')
    for (const healthCheck of healthChecks) {
      const executor = HealthCheckExecutorFactory.get(healthCheck)
      this.timeouts[healthCheck.id] = setInterval(async () => {
        await executor.execute()
        // TODO: Update the result to database
        // TODO: Invoke a realtime push to ui using sockets
      }, healthCheck.interval)
    }
  }
}

let healthCheckProcessor: IHealthCheckProcessor
const healthCheckProcessorFactory = {
  get: (dataSource: IDataSource): IHealthCheckProcessor => {
    if (healthCheckProcessor) return healthCheckProcessor
    healthCheckProcessor = new HealthCheckProcessor(dataSource)
    return healthCheckProcessor
  }
}

export { healthCheckProcessorFactory }
