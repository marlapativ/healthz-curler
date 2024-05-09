import { ThemeProvider } from '@/components/theme-provider'
import { AppLayout } from '@/layouts/root'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ConfigSelector } from '@/pages/config-selector'
import { Home } from './pages/home'

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
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppLayout>
        <RouterProvider router={router} />
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
