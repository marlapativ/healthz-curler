declare global {
  interface Error extends ResultError<Error> {
    test: string
  }

  type ResultOk<T> = {
    ok: true
    value: T
  }

  type ResultError<E extends Error> = {
    ok: false
    error: E
  }

  type Result<T, E extends Error> = ResultOk<T> | ResultError<E>

  const Ok = <T>(data: T): Result<T, never> => {
    return { ok: true, value: data }
  }
}

export {}
