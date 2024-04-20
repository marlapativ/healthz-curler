import notificationLogger from '../../../config/notification.logger'
import { NotificationType } from '../notification'
import { INotificationExecutor } from './notification.executor'
import { IPubSubService } from '../../socket/socket.pubsub'
import { INotification } from '../notification.processor'

export class SocketNotificationExecutor implements INotificationExecutor {
  pubsub: IPubSubService
  constructor(pubsub: IPubSubService) {
    this.pubsub = pubsub
  }

  async execute<T>(type: NotificationType, notification: INotification<T>): Promise<void> {
    notificationLogger.info(`SocketNotificationExecutor: ${type} for id: ${notification.id}`)
    const channel = `${type}:${notification.id}`
    await this.pubsub.publish(channel, notification.message)
  }
}
