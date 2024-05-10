import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/layouts/root'
import { Home } from '@/pages/home'
import { ConfigContext } from '@/context/context'
import { Config } from '@/types/config'

function App() {
  const [config, setConfig] = useState<Config | null>(null)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ConfigContext.Provider value={{ config, setConfig }}>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </AppLayout>
        </ConfigContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
