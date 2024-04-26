import Elysia from 'elysia'
import env from '../utils/env.util'

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

const getConfig = async () => {
  const port = env.getOrDefault('SERVER_PORT', '4205')
  const config: Config = {
    id: 'bun-elysia',
    runtime: 'bun',
    apiVersion: 'v1',
    server: {
      port,
      framework: 'Elysia'
    },
    websocket: [
      {
        name: 'websocket',
        path: '/ws',
        port
      },
      {
        name: 'socket.io',
        path: '/socket.io',
        port: env.getOrDefault('SOCKETIO_PORT', '4206')
      }
    ]
  }

  return config
}

const configRouter = () => {
  return new Elysia<'config', false, Context>({ prefix: 'config', tags: ['config'] }).get<'/', any, any, any>(
    '/',
    getConfig
  )
}

export { configRouter }
