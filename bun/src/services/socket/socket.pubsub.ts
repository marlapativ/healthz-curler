import { ServerWebSocket } from 'bun'
import { ElysiaWS } from 'elysia/ws'
import logger from '../../config/logger'
import { TypeCheck } from 'elysia/type-system'
import { InputSchema, MergeSchema, TSchema, UnwrapRoute } from 'elysia'

export interface IPubSubService {
  publish<T>(channel: string, message: T): Promise<void>
  subscribe<T>(channel: string, callback: (message: T) => void): Promise<void>
}
export type IWebSocketMessage = {
  type: 'subscribe' | 'unsubscribe'
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
}

export class PubSubService implements IPubSubService, IWebSocketMessageHandler {
  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${message}`)
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
    const message = messageUnknown as IWebSocketMessage
    logger.info(`PubSubService: ${message.type} - ${message.channel}`)
    if (message.type === 'subscribe') {
      ws.subscribe(message.channel)
    } else if (message.type === 'unsubscribe') {
      ws.unsubscribe(message.channel)
    }
  }
}
