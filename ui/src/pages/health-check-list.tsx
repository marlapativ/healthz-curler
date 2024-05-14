import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { HealthCheck } from '../types/healthcheck'
import { Loader, LoaderState } from '../components/loader'
import { fetchApi } from '../lib/env-utils'
import { Badge } from '../components/ui/badge'
import { Check, X } from 'lucide-react'

export function HealthCheckList() {
  const [loader, setLoader] = useState(LoaderState.LOADING)
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])

  useEffect(() => {
    fetchApi('/api/v1/healthcheck')
      .then((res) => res.json())
      .then((data) => {
        setHealthChecks(data)
        setLoader(LoaderState.SUCCESS)
      })
      .catch(() => setLoader(LoaderState.ERROR))
  }, [])
  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 md:pb-8 lg:py-2 lg:pb-20">
      <p className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Health Checks
      </p>
      <p className="max-w-[750px] text-center text-lg font-light text-foreground"></p>

      <Loader state={loader} errorMessage="Unable to fetch healthchecks!">
        {healthChecks.map((healthCheck, i) => (
          <Card key={i} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-6 py-2 pb-1 pt-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{healthCheck.id}</CardTitle>
            </CardHeader>
            <CardContent className="flex p-0 px-6 pb-2 justify-between	">
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
