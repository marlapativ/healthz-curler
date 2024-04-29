import { WebSocket, WebSocketServer } from 'ws'
import {
  ISocketPublisher,
  ISocketMessageHandler,
  WebSocketMessage,
  WebSocketMessageType
} from 'healthz-curler-shared-js'
import { Logger } from 'healthz-curler-shared-js'
const logger = Logger(__filename)

export type IWebSocketMessageHandler = ISocketMessageHandler<WebSocket, WebSocketServer>

export class WebSocketPublisherService implements ISocketPublisher, IWebSocketMessageHandler {
  server: WebSocketServer | null = null
  rooms: Map<string, Set<WebSocket>> = new Map()

  private getRoom = (channel: string): Set<WebSocket> => {
    if (!this.rooms.has(channel)) {
      this.rooms.set(channel, new Set<WebSocket>())
    }
    return this.rooms.get(channel)!
  }

  init(server: WebSocketServer): void {
    this.server = server
    this.server.addListener('connection', (ws: WebSocket) => {
      ws.on('close', () => {
        this.rooms.forEach((room) => {
          room.delete(ws)
        })
      })
    })
  }

  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`Publishing to channel: ${channel}`)
    this.getRoom(channel).forEach((ws) => {
      ws.send(JSON.stringify(message))
    })
  }

  message(ws: WebSocket, message: WebSocketMessage): void {
    logger.info(`Websocket connection: ${message.type} - ${message.channel}`)
    if (message.type === WebSocketMessageType.SUBSCRIBE) {
      this.getRoom(message.channel).add(ws)
    } else if (message.type === WebSocketMessageType.UNSUBSCRIBE) {
      this.getRoom(message.channel).delete(ws)
    }
  }
}
