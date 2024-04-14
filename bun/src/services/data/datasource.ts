import env from '../../utils/env.utils'
import { InMemoryDataSource } from './inmemory.datasource'
import { RedisDataSource } from './redis.datasource'

export interface IDataSource {
  init: () => Promise<void>
  set: <T>(key: string, data: T) => Promise<Result<T, Error>>
  get: <T>(key: string) => Promise<Result<T, Error>>
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
        return new InMemoryDataSource()
    }
    return dataSource
  }
}

export { dataSourceFactory }
