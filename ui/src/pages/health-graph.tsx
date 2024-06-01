import { useState, useContext, useEffect } from 'react'
import { ConfigContext } from '../context'
import { Loader, LoaderState } from '../components/loader'
import { fetchApi } from '../lib/env-utils'

export function HealthGraph({ id }: { id: string }) {
  const { activeConfig } = useContext(ConfigContext)
  const [loader, setLoader] = useState(LoaderState.LOADING)
  const [data, setHealthChecks] = useState<unknown[]>([])

  useEffect(() => {
    fetchApi(`/api/v1/healthgraph/${id}`, {
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
  }, [activeConfig, id])

  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      <Loader state={loader} errorMessage="Unable to fetch healthchecks!">
        <div>HEALTH GRAPH</div>
        {data.map((e, index) => (
          <p key={index}>{String(e)}</p>
        ))}
      </Loader>
    </section>
  )
}
