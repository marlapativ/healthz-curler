import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { ISocketIOMessageHandler, env } from 'healthz-curler-shared-js'
import { dataSourceFactory } from 'healthz-curler-shared-js'
import { ISocketMessageHandler, WebSocketMessage } from 'healthz-curler-shared-js'
import { apiRouter } from './controllers'
import { seedDatabase } from './seed/seed.data'
import { container } from './container'
import { Server as SocketIOServer } from 'socket.io'
import { Server, ServerWebSocket } from 'bun'
import { Logger } from 'healthz-curler-shared-js'
const logger = Logger(import.meta.file)

const SERVER_PORT = env.getOrDefault('SERVER_PORT', '4205')
const SOCKETIO_PORT = env.getOrDefault('SOCKETIO_PORT', '4206')

const startServer = () => {
  const webSocketMessageHandler = container.get<ISocketMessageHandler<ServerWebSocket, Server>>(
    'ISocketMessageHandler<ServerWebSocket, Server>'
  )
  const elysiaServer = new Elysia()
    .use(cors())
    .use(
      swagger({
        provider: 'swagger-ui',
        autoDarkMode: false,
        documentation: {
          info: {
            title: 'Healthz-curler API',
            version: '1.0.0',
            description: 'Healthz-curler API Documentation'
          },
          tags: [
            {
              name: 'config',
              description: 'Config API'
            },
            {
              name: 'healthcheck',
              description: 'Healthcheck API'
            },
            {
              name: 'healthgraph',
              description: 'Healthgraph API'
            }
          ]
        }
      })
    )
    .state('container', container)
    .use(apiRouter())
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
  const socketIOMessageHandler = container.get<ISocketIOMessageHandler>('ISocketIOMessageHandler')
  const io = new SocketIOServer(parseInt(SOCKETIO_PORT))
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
