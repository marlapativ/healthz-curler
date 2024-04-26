import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import env from './utils/env.util'
import { dataSourceFactory } from './services/data/datasource/datasource'
import { apiRoutes } from './controllers'
import { seedDatabase } from './seed/seed.data'
import { container } from './container'
import { ISocketMessageHandler, WebSocketMessage } from './services/socket/socket.publisher'
import { Server as SocketIOServer, Socket as SocketIOSocket } from 'socket.io'
import Logger from './config/logger'
import { Server, ServerWebSocket } from 'bun'
const logger = Logger(import.meta.file)

const SERVER_PORT = env.getOrDefault('SERVER_PORT', '4205')
const SOCKETIO_PORT = env.getOrDefault('SOCKETIO_PORT', '4206')

const startServer = () => {
  const webSocketMessageHandler = container.get<ISocketMessageHandler<ServerWebSocket, Server>>(
    'ISocketMessageHandler<ServerWebSocket, Server>'
  )
  const elysiaServer = new Elysia()
    .use(cors())
    .use(swagger())
    .state('container', container)
    .use(apiRoutes)
    .ws('/ws', {
      message: (ws, msg) => {
        const websocket = ws as unknown as ServerWebSocket
        const message = msg as WebSocketMessage
        return webSocketMessageHandler.message(websocket, message)
      }
    })

  elysiaServer
    .onStart((elysiaServer) => {
      const httpServer = elysiaServer.server!
      webSocketMessageHandler.init(httpServer)
    })
    .listen(SERVER_PORT, ({ hostname, port }) => {
      logger.info(`Server running on port ${port}`)
      logger.info(`Swagger: http://${hostname}:${port}/swagger`)
    })

  // Setup SocketIO Server
  startSocketIOServer()

  return elysiaServer
}

const startSocketIOServer = () => {
  const socketIOMessageHandler = container.get<ISocketMessageHandler<SocketIOSocket, SocketIOServer>>(
    'ISocketMessageHandler<SocketIOSocket, SocketIOServer>'
  )
  const io = new SocketIOServer(parseInt(SOCKETIO_PORT))
  io.on('connection', (socket) => {
    socket.on('message', (msg: string) => {
      const message = JSON.parse(msg) as WebSocketMessage
      socketIOMessageHandler.message(socket, message)
    })
  })
  socketIOMessageHandler.init(io)
}

const server = Promise.resolve()
  .then(async () => {
    logger.info('Initializing data source')
    const dataSource = dataSourceFactory.get()
    const result = await dataSource.init()
    logger.info('Data source initialized')
    return result
  })
  .then(async (db) => {
    logger.info('Seeding database')
    const seedResult = await seedDatabase(db)
    logger.info(`Database seed status: ${seedResult}`)
  })
  .then(async () => {
    logger.info('Initializing container')
    await container.init()
    logger.info('Container initialized')
  })
  .then(() => {
    return startServer()
  })
  .catch((error) => {
    logger.error('Error initializing database/server', error)
    console.error(error)
    process.exit(1)
  })

export { server }
