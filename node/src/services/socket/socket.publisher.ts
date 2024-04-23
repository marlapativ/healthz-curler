import Logger from '../../config/logger'
import { Socket } from 'socket.io'
const logger = Logger(import.meta.file)

export enum WebSocketMessageType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe'
}

export type WebSocketMessage = {
  type: WebSocketMessageType
  channel: string
}

export interface IWebSocketPublisher {
  publish<T>(channel: string, message: T): Promise<void>
}

export interface IWebSocketMessageHandler {
  message(ws: Socket, message: WebSocketMessage): unknown
  init(server: Socket | null): void
}

export class WebSocketPublisherService implements IWebSocketPublisher, IWebSocketMessageHandler {
  server: Socket | null = null
  init(server: Socket | null): void {
    this.server = server
  }

  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`Publishing to channel: ${channel}`)
    this.server?.emit(channel, JSON.stringify(message))
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
