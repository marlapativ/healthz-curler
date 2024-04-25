import { NotificationType } from '../notification'
import { INotificationExecutor } from './notification.executor'
import { ISocketPublisher } from '../../socket/socket.publisher'
import { Notification } from '../notification.processor'
import Logger from '../../../config/logger'
const logger = Logger(__filename)

export class SocketNotificationExecutor implements INotificationExecutor {
  pubsub: ISocketPublisher
  constructor(pubsub: ISocketPublisher) {
    this.pubsub = pubsub
  }

  async execute<T>(type: NotificationType, notification: Notification<T>): Promise<void> {
    logger.info(`SocketNotificationExecutor: ${type} for id: ${notification.id}`)
    const channel = `${type}:${notification.id}`
    await this.pubsub.publish(channel, notification.message)
  }
}
