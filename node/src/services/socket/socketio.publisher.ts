import { Server, Socket } from 'socket.io'
import { ISocketPublisher, ISocketMessageHandler, WebSocketMessage, WebSocketMessageType } from './socket.publisher'
import Logger from '../../config/logger'
const logger = Logger(__filename)

export class SockerIOPublisherService implements ISocketPublisher, ISocketMessageHandler<Socket, Server> {
  server: Server | null = null
  init(server: Server): void {
    this.server = server
  }

  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`Publishing to channel: ${channel}`)
    this.server?.to(channel).emit(channel, JSON.stringify(message))
  }

  message(ws: Socket, message: WebSocketMessage): void {
    logger.info(`Websocket connection: ${message.type} - ${message.channel}`)
    if (message.type === WebSocketMessageType.SUBSCRIBE) {
      ws.join(message.channel)
    } else if (message.type === WebSocketMessageType.UNSUBSCRIBE) {
      ws.leave(message.channel)
    }
  }
}
