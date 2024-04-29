import { Server, ServerWebSocket } from 'bun'
import {
  ISocketPublisher,
  ISocketMessageHandler,
  WebSocketMessage,
  WebSocketMessageType
} from 'healthz-curler-shared-js'
import { Logger } from 'healthz-curler-shared-js'
const logger = Logger(import.meta.file)

export class WebSocketPublisherService implements ISocketPublisher, ISocketMessageHandler<ServerWebSocket, Server> {
  server: Server | null = null
  init(server: Server): void {
    this.server = server
  }

  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`Publishing to channel: ${channel}`)
    this.server?.publish(channel, JSON.stringify(message))
  }

  message(ws: ServerWebSocket, message: WebSocketMessage): any {
    logger.info(`Websocket connection: ${message.type} - ${message.channel}`)
    if (message.type === WebSocketMessageType.SUBSCRIBE) {
      ws.subscribe(message.channel)
    } else if (message.type === WebSocketMessageType.UNSUBSCRIBE) {
      ws.unsubscribe(message.channel)
    }
  }
}
