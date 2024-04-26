declare global {
  declare namespace Express {
    export interface Request {
      container: IContainer
    }
  }
}

declare module 'ws' {
  export interface WebSocket {
    id: string
  }
}

export {}
