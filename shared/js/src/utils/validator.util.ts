function notNull<T>(value: T | null | undefined): value is T {
  return value !== null
}

const validator = {
  notNull
}

export default validator
