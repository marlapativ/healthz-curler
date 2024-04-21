import { ServerWebSocket } from 'bun'
import { ElysiaWS } from 'elysia/ws'
import logger from '../../config/logger'

export interface IPubSubService {
  publish<T>(channel: string, message: T): Promise<void>
  subscribe<T>(channel: string, callback: (message: T) => void): Promise<void>
}
export type IWebSocketMessage = {
  type: 'subscribe' | 'unsubscribe'
  channel: string
}

export interface IWebSocketMessageHandler {
  message(ws: ElysiaWS<ServerWebSocket<any>, any>, message: IWebSocketMessage): void
}

export class PubSubService implements IPubSubService, IWebSocketMessageHandler {
  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${message}`)
  }

  async subscribe<T>(channel: string, callback: (message: T) => void): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${callback}`)
  }

  message(ws: ElysiaWS<ServerWebSocket<any>>, message: IWebSocketMessage): void {
    logger.info(`PubSubService: ${message.type} - ${message.channel}`)
    if (message.type === 'subscribe') {
      ws.subscribe(message.channel)
    } else if (message.type === 'unsubscribe') {
      ws.unsubscribe(message.channel)
    }
  }
}
