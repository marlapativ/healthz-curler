import notificationLogger from '../../../config/notification.logger'
import { NotificationType } from '../notification'
import { INotificationExecutor } from './notification.executor'

export class SocketNotificationExecutor implements INotificationExecutor {
  async execute<T>(type: NotificationType, message: T): Promise<void> {
    notificationLogger.info(`SocketNotificationExecutor: ${type} - ${message}`)
  }
}
