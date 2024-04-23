import Logger from '../../config/logger'

export enum WebSocketMessageType {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe'
}

export type WebSocketMessage = {
  type: WebSocketMessageType
  channel: string
}

export interface ISocketPublisher {
  publish<T>(channel: string, message: T): Promise<void>
}

export interface ISocketMessageHandler<SocketType, Server> {
  message(ws: SocketType, message: WebSocketMessage): any
  init(server: Server | null): void
}
