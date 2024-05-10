import { useContext } from 'react'
import { ConfigContext } from '../context/context'
import { AlertCircle } from 'lucide-react'

export function Config() {
  const { config } = useContext(ConfigContext)

  return config ? <CurrentConfig selectedConfig={config.runtime} /> : <NoConfig />
}

function NoConfig() {
  return (
    <div className="flex items-center text-sm font-medium text-destructive gap-1">
      <AlertCircle className="h-4 w-4 text-destructive dark:border-destructive [&>svg]:text-destructive"></AlertCircle>
      Configuration not selected
    </div>
  )
}

function CurrentConfig({ selectedConfig }: { selectedConfig: string }) {
  return (
    <div className="flex items-center text-sm font-medium text-muted-foreground">
      Current Configuration:
      <span className="pl-1">
        <b>{selectedConfig}</b>
      </span>
    </div>
  )
}
