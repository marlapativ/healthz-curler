const Ok = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data }
}

export { Ok }
