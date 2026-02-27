'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import BodyLayout from './BodyLayout'

/**
 * ClientLayoutWrapper
 * - Aplica animaciones suaves entre rutas (excepto dashboard/admin)
 * - Restablece scroll al tope en cada cambio de página
 * - Optimiza performance con LazyMotion
 * - Respeta "prefers-reduced-motion"
 */
export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  const isDashboard = useMemo(() => {
    if (!pathname) return false
    return pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  }, [pathname])

  // 🔝 Scroll al tope en cada cambio (solo en rutas normales)
  useEffect(() => {
    if (isDashboard) return
    // Mejor instantáneo para UX, evita "rebotes" al navegar
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, isDashboard])

  // Si es dashboard/admin, render sin wrappers ni animaciones
  if (isDashboard) return <>{children}</>

  // Variantes de animación (si reduceMotion, se desactiva movimiento)
  const variants = {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
  }

  return (
    <BodyLayout>
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={pathname}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="min-h-screen will-change-transform"
          >
            {children}
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </BodyLayout>
  )
}
