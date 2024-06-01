import { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { HealthCheck } from '../types/healthcheck'
import { Loader, LoaderState } from '../components/loader'
import { fetchApi } from '../lib/env-utils'
import { Badge } from '../components/ui/badge'
import { Check, Plus, X } from 'lucide-react'
import { HealthCheckFlyout } from '../components/healthcheck-flyout'
import { Button } from '../components/ui/button'
import { ConfigContext } from '../context'

export function HealthCheckList() {
  const { activeConfig } = useContext(ConfigContext)
  const [loader, setLoader] = useState(LoaderState.LOADING)
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])

  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [selectedHealthCheck, setSelectedHealthCheck] = useState<HealthCheck | undefined>(undefined)

  useEffect(() => {
    fetchApi('/api/v1/healthcheck', {
      headers: {
        'Content-Type': 'application/json',
        server: activeConfig!.runtime
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setHealthChecks(data)
        setLoader(LoaderState.SUCCESS)
      })
      .catch(() => setLoader(LoaderState.ERROR))
  }, [activeConfig])

  const showFlyout = (healthCheck?: HealthCheck) => {
    setSelectedHealthCheck(healthCheck)
    setFlyoutOpen(true)
  }

  const saveHealthCheck = async (healthcheck: HealthCheck) => {
    const url = healthcheck ? `/api/v1/healthcheck/${healthcheck.id}` : '/api/v1/healthcheck'
    const method = healthcheck ? 'PUT' : 'POST'
    const res = await fetchApi(url, {
      method,
      body: JSON.stringify(healthcheck),
      headers: {
        'Content-Type': 'application/json',
        server: activeConfig!.runtime
      }
    })
    if (res.ok) {
      const result = await res.json()
      updateHealthCheckState(result)
      return result as Promise<HealthCheck>
    }
    throw new Error('Failed to save healthcheck')
  }

  const updateHealthCheckState = (healthCheck: HealthCheck) => {
    if (healthCheck.id) {
      setHealthChecks((healthChecks) => {
        const index = healthChecks.findIndex((hc) => hc.id === healthCheck.id)
        if (index !== -1) {
          healthChecks[index] = healthCheck
        } else {
          healthChecks.push(healthCheck)
        }
        return [...healthChecks]
      })
    }
  }

  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 md:pb-8 lg:py-2 lg:pb-20">
      <p className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Health Checks
      </p>
      <HealthCheckFlyout
        open={flyoutOpen}
        onOpenChange={setFlyoutOpen}
        healthcheck={selectedHealthCheck}
        onHealthCheckSave={saveHealthCheck}
      ></HealthCheckFlyout>
      <Loader state={loader} errorMessage="Unable to fetch healthchecks!">
        <div className="flex justify-end w-full">
          <Button variant={'outline'} className="border-green" onClick={() => showFlyout()}>
            <Plus className="h-4 w-4 mr-1"></Plus>
            <p className="text-md font-bold">Add Health Check</p>
          </Button>
        </div>
        {healthChecks.map((healthCheck, i) => (
          <Card key={i} className="w-full" onClick={() => showFlyout(healthCheck)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-6 py-2 pb-1 pt-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{healthCheck.id}</CardTitle>
            </CardHeader>
            <CardContent className="flex p-0 px-6 pb-2 justify-between">
              <div>
                <div className="text-2xl font-bold">{healthCheck.name}</div>
                <p className="text-sm text-muted-foreground">{healthCheck.description}</p>
              </div>
              <div>
                {healthCheck.active ? (
                  <Badge variant={'outlineActive'}>
                    <Check className="h-4 w-4 mr-1"></Check>
                    ACTIVE
                  </Badge>
                ) : (
                  <Badge variant={'outlineInactive'}>
                    <X className="h-4 w-4 mr-1"></X>
                    INACTIVE
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </Loader>
    </section>
  )
}
