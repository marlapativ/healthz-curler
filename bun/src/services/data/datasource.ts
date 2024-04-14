import { InMemoryDataSource } from './inmemory.datasource'
import { RedisDataSource } from './redis.datasource'

export interface IDataSource {
  init: () => Promise<void>
  set: <T>(key: string, data: T) => Promise<Result<T, Error>>
  get: <T>(key: string) => Promise<Result<T, Error>>
}

const dataSourceFactory = {
  create: (type?: string): IDataSource => {
    switch (type) {
      case 'inmemory':
        return new InMemoryDataSource()
      case 'redis':
        const redisDb = new RedisDataSource()
        return redisDb
      default:
        return new InMemoryDataSource()
    }
  }
}

export { dataSourceFactory }
