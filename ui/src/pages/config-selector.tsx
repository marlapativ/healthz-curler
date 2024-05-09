import { useContext, useEffect, useState } from 'react'
import { fetchApi } from '../lib/env-utils'
import { Config } from '../types/config'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ConfigContext } from '../context/context'

export function ConfigSelector() {
  const [apiConfigurations, setApiConfigurations] = useState<Config[]>([])
  const { config, setConfig } = useContext(ConfigContext)

  useEffect(() => {
    fetchApi('/api/v1/config')
      .then((res) => res.json())
      .then((data) => setApiConfigurations(data))
  }, [])

  return (
    <div>
      <div className="text-center p-2">
        <h1>Configuration selection</h1>
        <div className="p-2 flex items-center justify-center">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select backend" />
            </SelectTrigger>
            <SelectContent defaultValue={config?.id}>
              <SelectGroup>
                <SelectLabel>Backend</SelectLabel>
                {apiConfigurations.map((config) => (
                  <SelectItem key={config.id} onSelect={() => setConfig(config)} value={config.id}>
                    {config.id}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
