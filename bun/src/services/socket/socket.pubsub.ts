import { Server, ServerWebSocket } from 'bun'
import { ElysiaWS } from 'elysia/ws'
import logger from '../../config/logger'
import { TypeCheck } from 'elysia/type-system'
import { InputSchema, MergeSchema, TSchema, UnwrapRoute } from 'elysia'

export interface IPubSubService {
  publish<T>(channel: string, message: T): Promise<void>
  subscribe<T>(channel: string, callback: (message: T) => void): Promise<void>
}

export enum WebSocketMessageType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe'
}

export type WebSocketMessage = {
  type: WebSocketMessageType
  channel: string
}

export interface IWebSocketMessageHandler {
  // TODO: Remove the type safety from here and move it to ws decorator
  message:
    | ((
        ws: ElysiaWS<
          ServerWebSocket<{ validator?: TypeCheck<TSchema> | undefined }>,
          MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}> & { params: Record<never, string> },
          { decorator: {}; store: { container: IContainer }; derive: {}; resolve: {} } & {
            derive: {} & {}
            resolve: {} & {}
          }
        >,
        message: unknown
      ) => any)
    | undefined

  init(server: Server | null): void
}

export class PubSubService implements IPubSubService, IWebSocketMessageHandler {
  server: Server | null = null
  init(server: Server | null): void {
    this.server = server
  }

  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${message}`)
    this.server?.publish(channel, JSON.stringify(message))
  }

  async subscribe<T>(channel: string, callback: (message: T) => void): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${callback}`)
  }

  message(
    ws: ElysiaWS<
      ServerWebSocket<{ validator?: TypeCheck<TSchema> | undefined }>,
      MergeSchema<UnwrapRoute<InputSchema<never>, {}>, {}> & { params: Record<never, string> },
      { decorator: {}; store: { container: IContainer }; derive: {}; resolve: {} } & {
        derive: {} & {}
        resolve: {} & {}
      }
    >,
    messageUnknown: unknown
  ): void {
    const message = messageUnknown as WebSocketMessage
    logger.info(`Websocket connection: PubSubService: ${message.type} - ${message.channel}`)
    if (message.type === WebSocketMessageType.SUBSCRIBE) {
      ws.subscribe(message.channel)
    } else if (message.type === WebSocketMessageType.UNSUBSCRIBE) {
      ws.unsubscribe(message.channel)
    }
  }
}
