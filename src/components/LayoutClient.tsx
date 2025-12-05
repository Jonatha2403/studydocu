'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layouts/Navbar'
import ClientWrapper from '@/components/ClientWrapper'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''

  const ocultarNavbar =
  pathname.startsWith('/dashboard') ||
  pathname.startsWith('/admin') ||
  pathname === '/onboarding' ||
  pathname === '/registrarse' ||
  pathname === '/ingresar' ||
  pathname === '/verificado'


  return (
    <ClientWrapper>
      <div className="min-h-screen flex flex-col">
        {!ocultarNavbar && <Navbar />}
        <main className={`flex-1 transition-all ${!ocultarNavbar ? 'pt-[6.5rem]' : ''}`}>
          {children}
        </main>
      </div>
    </ClientWrapper>
  )
}
