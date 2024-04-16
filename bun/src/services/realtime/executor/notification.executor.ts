import { NotificationType } from '../notification'

export interface INotificationExecutor {
  execute<T>(type: NotificationType, message: T): Promise<void>
}
