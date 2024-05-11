import { useContext, useState } from 'react'
import { AlertCircle, Check, Edit } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ConfigContext } from '../context/context'
import { Button } from './ui/button'
import { ConfigSelector } from './config-selector'
import { Badge } from './ui/badge'

export function NavConfig() {
  const { activeConfig } = useContext(ConfigContext)
  const [hoverOpen, setHoverOpen] = useState<boolean>(false)
  const [configOpen, setConfigOpen] = useState<boolean>(false)

  return (
    <>
      <ConfigSelector open={configOpen} onOpenChange={setConfigOpen} />
      <HoverCard openDelay={0} closeDelay={400} open={hoverOpen} onOpenChange={setHoverOpen}>
        <HoverCardTrigger asChild>
          {activeConfig ? (
            <div className="h-10 flex items-center text-sm font-medium text-muted-foreground gap-1">
              Configuration:
              <Badge variant={'outlineActive'}>
                <Check className="h-4 w-4 mr-1"></Check>
                ACTIVE
              </Badge>
            </div>
          ) : (
            <div className="flex items-center text-sm font-medium text-destructive gap-1">
              <AlertCircle className="h-4 w-4 text-destructive dark:border-destructive [&>svg]:text-destructive"></AlertCircle>
              Configuration not selected
            </div>
          )}
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex flex-col justify-between space-x-4 space-y-2">
            <div className="space-y-1 flex flex-col">
              <h4 className="text-sm font-semibold">{activeConfig ? 'Configuration' : 'Configuration Error'}</h4>
              <div className="flex flex-col py-2">
                {activeConfig ? (
                  <>
                    <div className="text-xs">
                      Framework: <b>{activeConfig.server.framework}</b>
                    </div>
                    <div className="text-xs">
                      Websocket: <b>{activeConfig.websocket[0].name}</b>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    App requires you to select a configuration to proceed ahead.
                  </span>
                )}
              </div>
              <Button size="xs" className="text-xs" onClick={() => setConfigOpen(true)}>
                {activeConfig ? 'Update Configuration' : 'Select Configuration'}
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <Button size={'xs'} variant={'ghost'} onClick={() => setConfigOpen(true)}>
        <Edit className="h-4 w-4"></Edit>
      </Button>
    </>
  )
}
