import { RedisClientType, createClient } from 'redis'
import { IDataSource } from './datasource'
import env from '../../utils/env.util'
import logger from '../../config/logger'
import validator from '../../utils/validator.util'
import { Ok } from '../../utils/result.util'

export class RedisDataSource implements IDataSource {
  _redis: RedisClientType

  constructor() {
    this._redis = createClient({
      socket: {
        host: env.getOrDefault('REDIS_HOST', 'localhost'),
        port: parseInt(env.getOrDefault('REDIS_PORT', '6379')),
        reconnectStrategy: 5000
      },
      pingInterval: 2000
    })
    this._redis.on('error', (error) => {
      logger.error(`Cannot connect to redis or redis error: ${error}`)
    })
  }

  async init(): Promise<void> {
    this._redis.connect()
  }

  async getAll<T>(keyPrefix: string): Promise<Result<Array<T>, Error>> {
    keyPrefix = keyPrefix.endsWith('*') ? keyPrefix : `${keyPrefix}*`
    const keys = await this._redis.keys(keyPrefix)
    const valuePromises = keys.map(async (eachKey): Promise<T | null> => {
      const objectId = eachKey.replace(keyPrefix, '')
      const val = await this.get<T>(objectId)
      return val.ok ? val.value : null
    })
    const data = await Promise.all(valuePromises)
    const results: T[] = data.filter(validator.notNull)
    return Ok(results)
  }

  async set<T>(key: string, data: T): Promise<Result<T, Error>> {
    await this._redis.set(key, JSON.stringify(data))
    const retrievedData = await this.get<T>(key)
    return retrievedData
  }

  async get<T>(key: string): Promise<Result<T, Error>> {
    const data = await this._redis.get(key)
    if (!data) return new Error('Data not found')
    return Ok(JSON.parse(data) as T)
  }
}
