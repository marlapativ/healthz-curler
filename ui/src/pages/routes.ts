import { NavItem } from '../types/nav'

const config: Record<string, NavItem> = {
  github: {
    title: 'GitHub',
    href: 'https://github.com/marlapativ/healthz-curler'
  }
}

const navItems: NavItem[] = Object.values(config)

export { config }
export { navItems }
