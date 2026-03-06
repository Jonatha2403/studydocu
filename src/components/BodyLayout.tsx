'use client'

import { usePathname } from 'next/navigation'
import LayoutClient from '@/components/LayoutClient'
import FloatingButtonsGroup from '@/components/FloatingButtonsGroup'
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground'
import ParticlesBackground from '@/components/ParticlesBackground'
import { UserProvider } from '@/context/UserContext'

export default function BodyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')
  const isAuthFlowRoute =
    pathname?.startsWith('/onboarding') || pathname?.startsWith('/auth/callback')

  return (
    <div className="min-h-screen relative">
      <UserProvider>
        {/* 🎨 Fondo animado solo en rutas públicas */}
        {!isDashboard && (
          <div className="absolute inset-0 -z-10 w-full min-h-screen">
            <AnimatedGradientBackground className="absolute inset-0 h-full w-full opacity-30" />
            <ParticlesBackground className="absolute inset-0 h-full w-full opacity-50" />
          </div>
        )}

        {/* 🌐 Layout público con navbar, footer, etc. */}
        {!isDashboard ? (
          <>
            <LayoutClient key={pathname}>{children}</LayoutClient>
            {!isAuthFlowRoute && <FloatingButtonsGroup />}
          </>
        ) : (
          children
        )}
      </UserProvider>
    </div>
  )
}
