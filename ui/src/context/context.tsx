import { createContext } from 'react'
import { Config } from '../types/config'

export type ConfigContextType = {
  config: Config | null
  setConfig: (config: Config) => void
}

export const ConfigContext = createContext<ConfigContextType>({
  config: null,
  setConfig: () => {}
})
