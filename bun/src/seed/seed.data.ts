import { Model } from 'healthz-curler-shared-js'
import { IDataSource } from 'healthz-curler-shared-js'
import { HealthCheck } from 'healthz-curler-shared-js'
import { Logger } from 'healthz-curler-shared-js'
const logger = Logger(import.meta.file)

export const healthChecksSeedData: HealthCheck[] = [
  {
    id: 'b1c4a89e-4905-5e3c-b57f-dc92627d011e',
    name: 'bun-webapp-fetch',
    description: 'Webapp Fetch Health Check',
    url: 'http://localhost:8080/healthz',
    executor: 'fetch',
    interval: 30000,
    active: true
  },
  {
    id: 'cdb63720-9628-5ef6-bbca-2e5ce6094f3c',
    name: 'bun-webapp-curl',
    description: 'Webapp Curl Health Check',
    url: 'http://localhost:8080/healthz',
    executor: 'curl',
    interval: 30000,
    active: true
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
    }
    return true
  } catch (error) {
    logger.error('Error seeding database', error)
    return false
  }
}
