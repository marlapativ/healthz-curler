declare global {
  interface Error extends ResultError<Error> {}

  type ResultOk<T> = {
    ok: true
    value: T
  }

  type ResultError<E extends Error> = {
    ok: false
    error: E
  }

  type Result<T, E extends Error> = ResultOk<T> | ResultError<E>

  class HttpStatusError extends Error {
    statusCode: number
    message: string | string[] | Error
    error: Error
    constructor(public statusCode: number, public message: string | string[] | Error) {
      super(message instanceof Error ? message.message : typeof message === 'string' ? message : message[0])
      this.statusCode = status
      this.message = message
    }
  }

  interface IContainer {
    init: () => Promise<void>
    get: <T>(key: string) => T
    //set<T>(type: Partial<Record<string, IContainerType<T>>>, value: T)
  }

  type Context = {
    decorator: {}
    store: {
      container: IContainer
    }
    derive: {}
    resolve: {}
  }
}

export {}
