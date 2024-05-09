export type ServerConfig = {
  port: number | string
  framework: string
}

export type WebsocketConfig = {
  name: string
  path: string
  port: number | string
}

export type Config = {
  id: string
  runtime: string
  apiVersion: string
  server: ServerConfig
  websocket: WebsocketConfig[]
}
