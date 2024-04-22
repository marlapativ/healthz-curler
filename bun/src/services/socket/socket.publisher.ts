import { Server, ServerWebSocket } from 'bun'
import { TypeCheck } from 'elysia/type-system'
import { InputSchema, MergeSchema, TSchema, UnwrapRoute } from 'elysia'
import Logger from '../../config/logger'
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
  message(ws: ServerWebSocket, message: WebSocketMessage): any
  init(server: Server | null): void
}

export class WebSocketPublisherService implements IWebSocketPublisher, IWebSocketMessageHandler {
  server: Server | null = null
  init(server: Server | null): void {
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
