import logger from '../../../config/logger'
import { NotificationType } from '../notification'
import { INotificationExecutor } from './notification.executor'

export class SocketNotificationExecutor implements INotificationExecutor {
  async execute<T>(type: NotificationType, message: T): Promise<void> {
    logger.info(`SocketNotificationExecutor: ${type} - ${message}`)
  }
}
