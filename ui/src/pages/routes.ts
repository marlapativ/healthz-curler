import { NavItem } from '../types/nav'

const config: Record<string, NavItem> = {
  config: {
    title: 'Configuration',
    href: '/config-selector'
  },
  github: {
    title: 'GitHub',
    href: 'https://github.com/marlapativ/healthz-curler'
  }
}

const navItems: NavItem[] = Object.values(config)

export { config }
export { navItems }
