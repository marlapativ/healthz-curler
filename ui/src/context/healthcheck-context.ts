import { createContext } from 'react'
import { HealthCheck } from '../types/healthcheck'

export type HealthCheckContextType = {
  healthChecks: HealthCheck[]
  setHealthChecks: (healthCheck: HealthCheck[]) => void
}

export const HealthCheckContext = createContext<HealthCheckContextType>({
  healthChecks: [],
  setHealthChecks: () => {}
})
