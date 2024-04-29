declare global {
  interface IContainer {
    init: () => Promise<void>
    get: <T>(key: string) => T
  }

  declare namespace Express {
    export interface Request {
      container: IContainer
    }
  }
}

export {}
