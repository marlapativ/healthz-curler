import express, { Request, Response } from 'express'
import { env } from 'healthz-curler-shared-js'

type ServerConfig = {
  port: number | string
  framework: string
}

type WebsocketConfig = {
  name: string
  path: string
  port: number | string
}

type Config = {
  id: string
  runtime: string
  apiVersion: string
  server: ServerConfig
  websocket: WebsocketConfig[]
}

const getConfig = async (_: Request, res: Response) => {
  const port = env.getOrDefault('SERVER_PORT', '4215')
  const socketIOPort = env.getOrDefault('SOCKETIO_PORT', '4216')
  const config: Config = {
    id: 'node-express',
    runtime: 'node',
    apiVersion: 'v1',
    server: {
      port,
      framework: 'Express'
    },
    websocket: [
      {
        name: 'node',
        path: '/ws',
        port
      },
      {
        name: 'node-socket.io',
        path: '/socket.io',
        port: socketIOPort
      }
    ]
  }

  return res.json(config)
}

const configRouter = express.Router()
configRouter.get('/', getConfig)

export { configRouter }
