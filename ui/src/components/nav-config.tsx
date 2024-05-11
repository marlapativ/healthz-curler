import { useContext, useState } from 'react'
import { AlertCircle, Check, Edit } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ConfigContext } from '@/context/context'
import { Button } from '@/components/ui/button'
import { ConfigSelector } from '@/components/config-selector-flyout'
import { Badge } from '@/components/ui/badge'
import { Config } from '../types/config'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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
              <h4 className="text-sm font-semibold">{activeConfig ? 'Active Configuration' : 'Configuration Error'}</h4>
              <div className="flex flex-col py-2">
                {activeConfig ? (
                  <DetailedConfig config={activeConfig} />
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

function DetailedConfig({ config }: { config: Config }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-6 py-2 pb-1 pt-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Backend</CardTitle>
        </CardHeader>
        <CardContent className="p-0 px-6 pb-2">
          <div className="text-xl font-bold">{config.id}</div>
          <p className="text-xs text-muted-foreground">Framework: {config.server.framework}</p>
        </CardContent>
      </Card>
      <Card className="mt-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-6 py-2 pb-1 pt-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Websocket</CardTitle>
        </CardHeader>
        <CardContent className="p-0 px-6 pb-2">
          <div className="text-xl font-bold">{config.websocket[0].name}</div>
          <p className="text-xs text-muted-foreground">Framework: {config.websocket[0].name}</p>
        </CardContent>
      </Card>
    </>
  )
}
