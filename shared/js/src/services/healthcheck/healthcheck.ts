import { Model } from '../../types/model'
export enum HealthCheckStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
  DEGRADED = 'degraded'
}

export type HealthCheckExecutorType = 'default' | string

export type HealthCheckResponse = {
  status: HealthCheckStatus
}

export interface HealthCheck extends Model {
  name: string
  description?: string
  url: string
  interval: number
  active: boolean
  method?: string
  expectedResponseCode?: number
  timeout?: number
  auth?: {
    username: string
    password: string
    apiKey: string
  }
  executor?: HealthCheckExecutorType
}

export const withDefaults = (healthCheck: HealthCheck): HealthCheck => {
  return {
    id: healthCheck.id,
    name: healthCheck.name,
    description: healthCheck.description || '',
    url: healthCheck.url,
    active: healthCheck.active,
    interval: healthCheck.interval || 30000,
    method: healthCheck.method || 'GET',
    expectedResponseCode: healthCheck.expectedResponseCode || 200,
    timeout: healthCheck.timeout || 5000,
    auth: healthCheck.auth,
    executor: healthCheck.executor || 'default'
  }
}
