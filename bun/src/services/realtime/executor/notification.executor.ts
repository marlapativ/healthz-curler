import { NotificationType } from '../notification'
import { Notification } from '../notification.processor'

export interface INotificationExecutor {
  execute<T>(type: NotificationType, notification: Notification<T>): Promise<void>
}
