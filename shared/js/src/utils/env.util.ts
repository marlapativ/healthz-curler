const getOrDefault = (key: string, defaultValue: string): string => {
  if (process.env[key]) {
    return process.env[key] as string
  }
  return defaultValue
}

const getRuntime = (): string => {
  const argv0 = process.argv0
  if (argv0.includes('node')) return 'node'
  else if (argv0.includes('deno')) return 'deno'
  else if (argv0.includes('bun')) return 'bun'
  return 'unknown'
}

const env = {
  getOrDefault,
  getRuntime
}

export { env }
export default env
