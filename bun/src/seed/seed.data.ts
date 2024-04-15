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
  healthCheck: healthChecksSeedData
}

export const seedDatabase = async (db: IDataSource) => {
  try {
    for (const [collection, data] of Object.entries(seedData)) {
      for (const item of data) {
        const exists = await db.has(item.id)
        if (!exists) await db.set(item.id, `${collection}:${item.id}`)
      }
      return true
    }
  } catch (error) {
    logger.error('Error seeding database', error)
    return false
  }
}
