declare global {
  declare namespace Express {
    export interface Request {
      container: IContainer
    }
  }
}

export {}
