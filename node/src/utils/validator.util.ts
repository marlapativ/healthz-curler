function notNull<T>(value: T | null | undefined): value is T {
  return value !== null
}

function isJson(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const validator = {
  notNull,
  isJson
}

export default validator
