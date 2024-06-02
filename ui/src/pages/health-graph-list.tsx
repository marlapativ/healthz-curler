import { useContext } from 'react'
import { HealthCheckContext } from '../context'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function HealthGraphList() {
  const { healthChecks } = useContext(HealthCheckContext)

  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      <p className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Health Checks Status
      </p>
      {healthChecks.map((healthCheck, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 px-6 py-2 pb-1 pt-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{healthCheck.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 px-6 pb-2">
            <div className="text-xl font-bold">{healthCheck.id}</div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
