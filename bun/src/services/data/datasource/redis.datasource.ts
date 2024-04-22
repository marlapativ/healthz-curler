import { RedisClientType, createClient } from 'redis'
import { IDataSource } from './datasource'
import env from '../../../utils/env.util'
import validator from '../../../utils/validator.util'
import { Ok } from '../../../utils/result.util'
import Logger from '../../../config/logger'
const logger = Logger(import.meta.file)

export class RedisDataSource implements IDataSource {
  _redis: RedisClientType

  constructor() {
    const redisUrl = env.getOrDefault('REDIS_URL', 'redis://localhost:6379/2')
    if (!redisUrl) throw new Error('REDIS_URL env variable is required')
    this._redis = createClient({
      url: redisUrl,
      database: parseInt(env.getOrDefault('REDIS_DB', '2')),
      pingInterval: 2000
    })
    this._redis.on('error', (error) => {
      logger.error(`Cannot connect to redis or redis error: ${error}`)
    })
  }

  async init(): Promise<IDataSource> {
    this._redis.connect()
    return this
  }

  async has(key: string): Promise<Result<boolean, Error>> {
    const exists = await this._redis.exists(key)
    return Ok(exists === 1)
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
    const exists = await this.has(key)
    if (!exists.ok) return new Error('Key does not exist')
    const data = await this._redis.get(key)
    return Ok(JSON.parse(data!) as T)
  }

  async delete(key: string): Promise<Result<boolean, Error>> {
    const exists = await this.has(key)
    if (!exists.ok) return new Error('Key does not exist')
    const result = await this._redis.del(key)
    return Ok(result === 1)
  }
}
