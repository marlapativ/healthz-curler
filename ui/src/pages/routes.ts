import { NavItem } from '../types/nav'

const config: Record<string, NavItem> = {
  healthCheck: {
    title: 'Health Checks',
    href: '/health-check'
  },
  configSelector: {
    title: 'Configuration Selector',
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
