import { INotificationExecutor } from '../../node/src/services/realtime/executor/notification.executor'

interface IContainerType<T> {
  identifier: string
  get(container: IContainer): T
}

class ContainerType<T> implements IContainerType<T> {
  identifier!: string
  constructor(identifier: string) {
    this.identifier = identifier
  }
  get(container: IContainer) {
    return container.get<T>(this.identifier)
  }
  toString() {
    return this.identifier
  }
}

const create = <T>(id: string): IContainerType<T> => new ContainerType<T>(id)

const Types: Record<string, IContainerType<any>> = {
  INotificationExecutor: create<INotificationExecutor>('INotificationExecutor')
}

export { IContainerType, Types }
