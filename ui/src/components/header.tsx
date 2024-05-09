import { NavItem } from '@/types/nav'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { navItems } from '@/pages/routes'
import { Link, NavLink } from 'react-router-dom'

interface NavBarProps {
  items?: NavItem[]
}

function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center space-x-2">
        <span className="inline-block font-bold">Healthz-Curler</span>
      </div>
    </Link>
  )
}

function NavBar({ items }: NavBarProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Logo />
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <NavLink
                  key={index}
                  to={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  {item.title}
                </NavLink>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <NavBar items={navItems} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
