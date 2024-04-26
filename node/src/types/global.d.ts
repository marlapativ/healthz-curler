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
    message: string | string[]
    constructor(
      public statusCode: number,
      public message: string | string[]
    ) {
      super(typeof message === 'string' ? message : message[0])
      this.statusCode = status
      this.message = message
    }
  }

  interface IContainer {
    init: () => Promise<void>
    get: <T>(key: string) => T
  }
}

export {}
