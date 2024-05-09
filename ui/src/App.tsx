import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/layouts/root'
import { ConfigSelector } from '@/pages/config-selector'
import { Home } from '@/pages/home'
import { ConfigContext } from '@/context/context'
import { Config } from '@/types/config'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/config-selector',
    element: <ConfigSelector />
  }
])

function App() {
  const [config, setConfig] = useState<Config | null>(null)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppLayout>
        <ConfigContext.Provider value={{ config, setConfig }}>
          <RouterProvider router={router} />
        </ConfigContext.Provider>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
