import { Ok } from '../../../utils/result.util'
import { IDataSource } from './datasource'
import _ from 'lodash'

export class InMemoryDataSource implements IDataSource {
  data: Map<string, unknown>
  constructor() {
    this.data = new Map()
  }
  has(key: string): Promise<Result<boolean, Error>> {
    return Promise.resolve(Ok(this.data.has(key)))
  }

  async init(): Promise<IDataSource> {
    return this
  }

  async getAll<T>(keyPrefix: string): Promise<Result<T[], Error>> {
    keyPrefix = keyPrefix.endsWith('*') ? keyPrefix.substring(0, keyPrefix.length - 1) : keyPrefix
    const result = [...this.data.entries()]
      .filter(([key]) => key.startsWith(keyPrefix))
      .map(([, value]) => _.cloneDeep<T>(value as T))
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

  async delete(key: string): Promise<Result<boolean, Error>> {
    const keyExists = this.data.has(key)
    if (!keyExists) return new Error(`Key ${key} not found`)
    this.data.delete(key)
    return Ok(true)
  }
}
