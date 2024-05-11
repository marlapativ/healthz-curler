import { ModeToggle } from '@/components/mode-toggle'
import { NavBar } from '@/components/ui/navbar'
import { navItems } from '@/pages/routes'
import { NavConfig } from './nav-config'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <NavBar items={navItems} />
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center gap-2">
            <NavConfig />
            <Separator orientation="vertical" className="h-10" />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
