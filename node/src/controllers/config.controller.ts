import express, { Request, Response } from 'express'
import env from '../utils/env.util'

type ServerConfig = {
  port: number | string
  framework: string
}

type WebsocketConfig = {
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
  const config: Config = {
    id: 'node-express',
    runtime: 'node',
    apiVersion: 'v1',
    server: {
      port: env.getOrDefault('SERVER_PORT', '4215'),
      framework: 'Express'
    },
    websocket: [
      {
        path: '/socket.io',
        port: env.getOrDefault('SOCKETIO_PORT', '4215')
      }
    ]
  }

  return res.json(config)
}

const configRouter = express.Router()
configRouter.get('/', getConfig)

export { configRouter }
