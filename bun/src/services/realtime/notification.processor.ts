import { NotificationType } from './notification'
import { INotificationExecutor } from './executor/notification.executor'

export interface INotification<T> {
  id: string
  message: T
}

export interface INotificationProcessor {
  notify<T>(type: NotificationType, notification: INotification<T>): Promise<void>
}

export class NotificationProcessor implements INotificationProcessor {
  notificationExecutors: INotificationExecutor[]

  constructor(notificationExecutors: INotificationExecutor[]) {
    this.notificationExecutors = notificationExecutors
  }

  async notify<T>(type: NotificationType, notification: INotification<T>): Promise<void> {
    const executions = this.notificationExecutors.map((executor) => executor.execute(type, notification))
    await Promise.all(executions)
  }
}
