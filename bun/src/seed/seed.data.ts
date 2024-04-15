import logger from '../config/logger'
import { IDataSource } from '../services/data/datasource'
import { HealthCheck } from '../services/healthcheck/healthcheck'
import { Model } from '../types/model'

export const healthChecksSeedData: HealthCheck[] = [
  {
    id: 'webapp',
    name: 'Webapp Health Check',
    description: 'Health check for the webapp',
    url: 'http://localhost:8080/healthz'
  }
]

const seedData: Record<string, Array<Model>> = {
  healthcheck: healthChecksSeedData
}

export const seedDatabase = async (db: IDataSource) => {
  try {
    for (const [collection, data] of Object.entries(seedData)) {
      for (const item of data) {
        const key = `${collection}:${item.id}`
        const exists = await db.has(key)
        if (!exists.ok) throw exists.error
        if (!exists.value) {
          const result = await db.set(key, item)
          if (!result.ok) throw result.error
        }
      }
      return true
    }
  } catch (error) {
    logger.error('Error seeding database', error)
    return false
  }
}
