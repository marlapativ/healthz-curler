import { NotificationType } from '../notification'
import { INotificationExecutor } from './notification.executor'
import { ISocketPublisher } from '../../socket/socket.publisher'
import { Notification } from '../notification.processor'
import Logger from '../../../config/logger'
const logger = Logger(import.meta.file)

export class SocketNotificationExecutor implements INotificationExecutor {
  publishers: ISocketPublisher[]
  constructor(pubsub: ISocketPublisher[]) {
    this.publishers = pubsub
  }

  async execute<T>(type: NotificationType, notification: Notification<T>): Promise<void> {
    logger.info(`SocketNotificationExecutor: ${type} for id: ${notification.id}`)
    const channel = `${type}:${notification.id}`
    const promises = this.publishers.map((publisher) => publisher.publish(channel, notification.message))
    await Promise.all(promises)
  }
}
