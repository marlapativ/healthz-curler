import React from 'react'
import { Header } from '@/components/header'

export function AppLayout({ children }: React.PropsWithChildren<object>) {
  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}
