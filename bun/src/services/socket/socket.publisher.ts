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

export interface ISocketMessageHandler<Socket, SocketServer> {
  init(server: SocketServer | null): void
  message(ws: Socket, message: WebSocketMessage): any
}
