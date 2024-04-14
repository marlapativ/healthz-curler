import { RedisClientType, createClient } from 'redis'
import { IDataSource } from './datasource'
import env from '../../utils/env.utils'
import logger from '../../config/logger'

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

  async set<T>(key: string, data: T): Promise<Result<T, Error>> {
    return new Error('Not implemented')
  }

  async get<T>(key: string): Promise<Result<T, Error>> {
    return new Error('Not implemented')
  }
}
