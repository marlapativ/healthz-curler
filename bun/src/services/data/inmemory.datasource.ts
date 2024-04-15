import { Ok } from '../../utils/result.util'
import { IDataSource } from './datasource'
import _ from 'lodash'

export class InMemoryDataSource implements IDataSource {
  data: Map<string, any>
  constructor() {
    this.data = new Map()
  }

  async init(): Promise<void> {
    return Promise.resolve()
  }

  async getAll<T>(keyPrefix: string): Promise<Result<T[], Error>> {
    keyPrefix = keyPrefix.endsWith('*') ? keyPrefix.substring(0, keyPrefix.length - 1) : keyPrefix
    const result = Object.entries(this.data)
      .filter(([key]) => key.startsWith(keyPrefix))
      .map(([, value]) => _.cloneDeep<T>(value))
    return Ok(result)
  }

  async set<T>(key: string, data: T): Promise<Result<T, Error>> {
    const clone = _.cloneDeep(data)
    this.data.set(key, clone)
    return Ok(data)
  }

  async get<T>(key: string): Promise<Result<T, Error>> {
    const keyExists = this.data.has(key)
    if (!keyExists) return new Error(`Key ${key} not found`)
    const value = this.data.get(key) as T
    const clone = _.cloneDeep(value)
    return Ok(clone)
  }
}
