import React from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export function AppLayout({ children }: React.PropsWithChildren<object>) {
  return (
    <div>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
