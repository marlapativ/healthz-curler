import { createContext } from 'react'
import { Config } from '../types/config'

export type ConfigContextType = {
  activeConfig: Config | null
  configurations: Config[]
  setConfig: (config: Config) => void
}

export const ConfigContext = createContext<ConfigContextType>({
  activeConfig: null,
  configurations: [],
  setConfig: () => {}
})
