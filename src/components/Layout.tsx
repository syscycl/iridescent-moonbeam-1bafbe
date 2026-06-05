import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppChat from './WhatsAppChat'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 min-h-[calc(100dvh-4rem)]">{children}</main>
      <Footer />
      <WhatsAppChat />
    </div>
  )
}
