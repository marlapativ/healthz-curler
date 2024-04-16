import { Model } from '../../types/model'
export enum HealthCheckStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded'
}

export enum HealthCheckExecutor {
  DEFAULT = 'default',
  CURL = 'curl'
}

export type HealthCheckResponse = {
  status: HealthCheckStatus
}

export interface HealthCheck extends Model {
  name: string
  description?: string
  url: string
  method?: string
  expectedResponseCode?: number
  timeout?: number
  active?: boolean
  auth?: {
    username: string
    password: string
    apiKey: string
  }
  executor?: HealthCheckExecutor
}
