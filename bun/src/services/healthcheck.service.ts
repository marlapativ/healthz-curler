import { dataSourceFactory, IDataSource } from './data/datasource'
export interface IHealthCheckService {}

class HealthCheckService implements IHealthCheckService {
  dataSourceService: IDataSource
  constructor(dataSourceService: IDataSource) {
    this.dataSourceService = dataSourceService
  }
}

const dataSource = dataSourceFactory.get()
const healthCheckService: IHealthCheckService = new HealthCheckService(dataSource)
export default healthCheckService
