import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-primary" />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

