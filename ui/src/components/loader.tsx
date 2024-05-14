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
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : state === LoaderState.ERROR ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">{errorMessage ?? 'Error!'}</p>
        </div>
      ) : (
        children
      )}
    </>
  )
}
