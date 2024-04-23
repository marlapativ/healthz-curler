import env from './utils/env.util'
import { dataSourceFactory } from './services/data/datasource/datasource'
import { apiRoutes } from './controllers'
import { seedDatabase } from './seed/seed.data'
import { container } from './container'
import { IWebSocketMessageHandler, WebSocketMessage } from './services/socket/socket.publisher'
import Logger from './config/logger'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
const logger = Logger(__filename)

const SERVER_PORT = env.getOrDefault('SERVER_PORT', '4215')

const startServer = () => {
  const socketMessageHandler = container.get<IWebSocketMessageHandler>('IWebSocketMessageHandler')

  const server = express()

  server.use(express.json())
  server.use(cors())
  server.use('/swagger')
  server.use('context', (req: Express.Request, _, next) => {
    req.container = container
    next()
  })
  // Setup routes
  apiRoutes(server)

  const httpServer = server.listen(SERVER_PORT, () => {
    logger.info(`Server running on port ${SERVER_PORT}`)
    logger.info(`Swagger: http://localhost:${SERVER_PORT}/swagger`)
  })

  const io = new Server(httpServer)
  socketMessageHandler.init(io)
  io.on('connection', (socket) => {
    socket.on('message', (message: WebSocketMessage) => {
      socketMessageHandler.message(socket, message)
    })
  })
  return server
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
    process.exit(1)
  })

export { server }
