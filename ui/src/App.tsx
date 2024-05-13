import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/layouts/root'
import { Home } from '@/pages/home'
import { ConfigContext } from '@/context/context'
import { Config } from '@/types/config'
import { fetchApi } from './lib/env-utils'
import { ConfigSelector } from './pages/config-selector'
import { HealthCheck } from './pages/health-check'

function App() {
  const [activeConfig, setConfig] = useState<Config | null>(null)
  const [configurations, setConfigurations] = useState<Config[]>([])

  useEffect(() => {
    fetchApi('/api/v1/config')
      .then((res) => res.json())
      .then((data) => setConfigurations(data))
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ConfigContext.Provider value={{ activeConfig, configurations, setConfig }}>
          <AppLayout>
            <Routes>
              <Route index path="/" element={activeConfig ? <Home /> : <Navigate to={'/config-selector'}></Navigate>} />
              <Route path="/config-selector" element={<ConfigSelector />} />
              <Route path="/health-check" element={<HealthCheck />} />
            </Routes>
          </AppLayout>
        </ConfigContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
