import Elysia from 'elysia'
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

const getConfig = async () => {
  const config: Config = {
    id: 'bun-elysia',
    runtime: 'bun',
    apiVersion: 'v1',
    server: {
      port: env.getOrDefault('SERVER_PORT', '4205'),
      framework: 'Elysia'
    },
    websocket: [
      {
        path: '/ws',
        port: env.getOrDefault('SERVER_PORT', '4205')
      },
      {
        path: '/socket.io',
        port: env.getOrDefault('SOCKETIO_PORT', '4206')
      }
    ]
  }

  return config
}

const configRouter = (server: Elysia<'/api/v1/config', false, Context>) => {
  return server.get('/', getConfig)
}

export { configRouter }
