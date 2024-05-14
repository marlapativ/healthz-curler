import { Loader2 } from 'lucide-react'

export enum LoaderState {
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}

type LoaderProps = React.PropsWithChildren<{
  state: LoaderState
  errorMessage?: string
}>

export function Loader({ state, errorMessage, children }: LoaderProps) {
  return (
    <>
      {state === LoaderState.LOADING ? (
        <div className="flex items-center justify-center min-h-80 h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : state === LoaderState.ERROR ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{errorMessage ?? 'Error!'}</p>
        </div>
      ) : (
        children
      )}
    </>
  )
}
