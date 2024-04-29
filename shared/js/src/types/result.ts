export type ResultOk<T> = {
  ok: true
  value: T
}

export interface ResultError<E extends Error> {
  ok: false
  error: E
}

export type Result<T, E extends Error> = ResultOk<T> | ResultError<E>
