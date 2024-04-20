import { NotificationType } from '../notification'
import { INotification } from '../notification.processor'

export interface INotificationExecutor {
  execute<T>(type: NotificationType, notification: INotification<T>): Promise<void>
}
