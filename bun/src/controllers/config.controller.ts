import Elysia, { Static, t } from 'elysia'
import env from '../utils/env.util'

const tServerConfig = t.Object({
  port: t.Union([t.Number(), t.String()]),
  framework: t.String()
})

const tWebsocketConfig = t.Object({
  name: t.String(),
  path: t.String(),
  port: t.Union([t.Number(), t.String()])
})

type Config = Static<typeof tConfig>
const tConfig = t.Object({
  id: t.String(),
  runtime: t.String(),
  apiVersion: t.String(),
  server: tServerConfig,
  websocket: t.Array(tWebsocketConfig)
})

const getConfig = async (): Promise<Config> => {
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
    getConfig,
    {
      response: tConfig,
      detail: {
        summary: 'Get the server configuration',
        description: 'Get the server configuration'
      }
    }
  )
}

export { configRouter }
