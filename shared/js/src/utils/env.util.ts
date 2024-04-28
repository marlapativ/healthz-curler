const getOrDefault = (key: string, defaultValue: string): string => {
  if (process.env[key]) {
    return process.env[key] as string
  }
  return defaultValue
}

const env = {
  getOrDefault
}

export { env }
export default env
