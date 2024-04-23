import Logger from '../../config/logger'
import { Server, Socket } from 'socket.io'
const logger = Logger(import.meta.filename)

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
  init(server: Server | null): void
}

export class WebSocketPublisherService implements IWebSocketPublisher, IWebSocketMessageHandler {
  server: Server | null = null
  init(server: Server | null): void {
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
