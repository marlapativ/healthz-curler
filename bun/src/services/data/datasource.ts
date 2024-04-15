import env from '../../utils/env.util'
import { InMemoryDataSource } from './inmemory.datasource'
import { RedisDataSource } from './redis.datasource'

export interface IDataSource {
  init: () => Promise<IDataSource>
  get: <T>(key: string) => Promise<Result<T, Error>>
  set: <T>(key: string, data: T) => Promise<Result<T, Error>>
  has: (key: string) => Promise<Result<boolean, Error>>
  getAll: <T>(keyPrefix: string) => Promise<Result<Array<T>, Error>>
}

let dataSource: IDataSource

const dataSourceFactory = {
  get: (): IDataSource => {
    if (dataSource) return dataSource

    const dataSourceType = env.getOrDefault('DATA_SOURCE', 'inmemory')
    switch (dataSourceType) {
      case 'redis':
        dataSource = new RedisDataSource()
        break
      case 'inmemory':
      default:
        dataSource = new InMemoryDataSource()
    }
    return dataSource
  }
}

export { dataSourceFactory }
