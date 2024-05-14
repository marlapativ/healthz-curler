export interface Model {
  id: string
}

export enum HealthCheckStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded'
}

export enum HealthCheckExecutorType {
  DEFAULT = 'default',
  CURL = 'curl',
  FETCH = 'fetch'
}

export type HealthCheckResponse = {
  status: HealthCheckStatus
}

export interface HealthCheck extends Model {
  id: string
  name: string
  description?: string
  url: string
  interval: number
  method?: string
  expectedResponseCode?: number
  timeout?: number
  active?: boolean
  auth?: {
    username: string
    password: string
    apiKey: string
  }
  executor?: HealthCheckExecutorType
}
