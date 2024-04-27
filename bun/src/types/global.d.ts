declare global {
  type ResultOk<T> = {
    ok: true
    value: T
  }

  interface ResultError<E extends Error> {
    ok: false
    error: E
  }

  type Result<T, E extends Error> = ResultOk<T> | ResultError<E>

  interface IContainer {
    init: () => Promise<void>
    get: <T>(key: string) => T
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
