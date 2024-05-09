import React from 'react'
import { PageHeader } from '../components/page-header'

export function RootLayout({ children }: React.PropsWithChildren<object>) {
  return (
    <div>
      <PageHeader />
      {children}
    </div>
  )
}
