import env from '../../../utils/env.util'
import { InMemoryDataSource } from './inmemory.datasource'
import { RedisDataSource } from './redis.datasource'
import Logger from '../../../config/logger'
const logger = Logger(import.meta.file)

export interface IDataSource {
  init: () => Promise<IDataSource>
  get: <T>(key: string) => Promise<Result<T, Error>>
  set: <T>(key: string, data: T) => Promise<Result<T, Error>>
  has: (key: string) => Promise<Result<boolean, Error>>
  delete: (key: string) => Promise<Result<boolean, Error>>
  getAll: <T>(keyPrefix: string) => Promise<Result<Array<T>, Error>>
}

let dataSource: IDataSource

const dataSourceFactory = {
  get: (): IDataSource => {
    if (dataSource) return dataSource
    const dataSourceType = env.getOrDefault('DATA_SOURCE', 'inmemory')
    logger.info(`Creating new data source. Type: ${dataSourceType}`)
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
