import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/layouts/root'
import { Home } from '@/pages/home'
import { ConfigContext } from '@/context/context'
import { Config } from '@/types/config'
import { fetchApi } from './lib/env-utils'
import { ConfigSelector } from './pages/config-selector'
import { HealthCheckList } from './pages/health-check-list'
import { useToast } from './components/ui/use-toast'
import { Toaster } from './components/ui/toaster'

function ConfiguredRoute({ activeConfig, children }: { children: React.ReactNode; activeConfig: Config | null }) {
  if (!activeConfig) {
    return <Navigate to={'/config-selector'}></Navigate>
  }
  return <>{children}</>
}

function App() {
  const [activeConfig, setConfig] = useState<Config | null>(null)
  const [configurations, setConfigurations] = useState<Config[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchApi('/api/v1/config/aggregate')
      .then((res) => res.json())
      .then((data) => Object.values<Config>(data))
      .then((data) => setConfigurations(data))
      .catch(() => {
        toast({
          title: 'Error fetching configurations',
          description: 'Please refresh to try again',
          variant: 'destructive'
        })
      })
  }, [toast])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ConfigContext.Provider value={{ activeConfig, configurations, setConfig }}>
          <AppLayout>
            <Toaster />
            <Routes>
              <Route path="/config-selector" element={<ConfigSelector />} />
              <Route
                index
                path="/"
                element={
                  <ConfiguredRoute activeConfig={activeConfig}>
                    <Home />
                  </ConfiguredRoute>
                }
              />
              <Route
                path="/health-check"
                element={
                  <ConfiguredRoute activeConfig={activeConfig}>
                    <HealthCheckList />
                  </ConfiguredRoute>
                }
              />
            </Routes>
          </AppLayout>
        </ConfigContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
