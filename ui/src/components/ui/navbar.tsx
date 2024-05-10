import { Link, NavLink } from 'react-router-dom'
import { NavItem } from '@/types/nav'
import { cn } from '@/lib/utils'

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

export function NavBar({ items }: NavBarProps) {
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
