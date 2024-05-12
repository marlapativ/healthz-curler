import { AlertTriangle, Check } from 'lucide-react'
import { ConfigSelectorFlyout } from '../components/config-selector-flyout'
import { Button } from '../components/ui/button'
import { useContext, useState } from 'react'
import { ConfigContext } from '../context/context'
import { Config } from '../types/config'
import { Link } from 'react-router-dom'

export function ConfigSelector() {
  const [showFlyout, setShowFlyout] = useState(false)
  const { activeConfig } = useContext(ConfigContext)

  return (
    <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
      {activeConfig ? <ActiveConfig activeConfig={activeConfig} /> : <NoConfig />}
      <div className="m-5">
        <ConfigSelectorFlyout open={showFlyout} onOpenChange={setShowFlyout}>
          <Button size="sm"> {activeConfig ? 'Update ' : 'Select '}Configuration</Button>
        </ConfigSelectorFlyout>
      </div>

      {activeConfig ? (
        <Link to="/" className="text-center text-lg font-bold text-foreground">
          <Button
            variant="outline"
            className="h-20 w-80 text-xl rounded-md px-8 mt-5 border-green-500 text-green-500 hover:bg-green-700"
          >
            Proceed to Home
          </Button>
        </Link>
      ) : null}
    </section>
  )
}

function NoConfig() {
  return (
    <>
      <AlertTriangle className="w-20 h-20 text-destructive dark:border-destructive [&>svg]:text-destructive" />
      <p className="text-center text-3xl text-destructive font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Configuration not set!
      </p>
      <p className="max-w-[750px] text-center text-md font-bold text-foreground">
        Please select a configuration to proceed ahead.
      </p>
    </>
  )
}

function ActiveConfig({ activeConfig }: { activeConfig: Config }) {
  return (
    <>
      <Check className="w-20 h-20 border-green-500 text-green-500" />
      <p className="text-center text-3xl border-green-500 text-green-500 font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Configuration active!
      </p>
      <p className="max-w-[750px] text-center text-lg font-light text-foreground">
        Framework: <b className="font-bold text-lg">{activeConfig.id}</b> <br />
      </p>
    </>
  )
}
