const Ok = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data }
}

export class Exception extends Error implements ResultError<Exception> {
  ok: false = false
  error: Exception = this
  constructor(message: string) {
    super(message)
  }
}

export class HttpStatusError extends Exception implements ResultError<HttpStatusError> {
  statusCode: number
  msg: string | string[]
  ok: false = false
  error: HttpStatusError = this
  constructor(statusCode: number, message: string | string[]) {
    super(typeof message === 'string' ? message : message[0])
    this.statusCode = statusCode
    this.msg = message
  }
}

export { Ok }
