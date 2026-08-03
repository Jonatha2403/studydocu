'use client'

import { useEffect, useState } from 'react'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Toaster as SonnerToaster, toast } from 'sonner'
import { ToastProvider } from '@/context/ToastContext'
import Toaster from '@/components/ui/Toaster'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import MobileDock from '@/components/layouts/MobileDock'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layouts/Navbar'
import Image from 'next/image'

const LoadingOverlay = dynamic(() => import('@/components/ui/LoadingOverlay'), {
  ssr: false,
})

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)

  const pathname = usePathname() ?? ''
  const isDashboardOrAdmin = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthFlowRoute =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/auth/reset-password') ||
    pathname.startsWith('/auth/cambiar-clave')

  useEffect(() => {
    let mounted = true

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!mounted) return
      if (error) console.error('❌ Error al obtener sesión:', error.message)

      // Solo seteamos userId, NO mostramos toast aquí
      setUserId(data.session?.user?.id ?? null)
      setSessionLoading(false)
    }

    void fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return

        setUserId(session?.user?.id ?? null)
        setSessionLoading(false)

        if (event === 'SIGNED_IN' && session?.user) {
          // Evitar repetir el mensaje en la misma sesión de navegador
          const alreadyShown = sessionStorage.getItem('welcome_shown')
          if (!alreadyShown) {
            toast.success('🎉 ¡Bienvenido de nuevo, estudiante!')
            sessionStorage.setItem('welcome_shown', '1')
          }
        }

        if (event === 'SIGNED_OUT') {
          sessionStorage.removeItem('welcome_shown')
        }
      }
    )

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ Service Worker registrado:', reg.scope))
        .catch((err) => console.error('❌ Error al registrar SW:', err))
    }

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', registerSW)
      return () => window.removeEventListener('load', registerSW)
    }
  }, [])

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-indigo-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200">
        {!isOnline && (
          <div className="bg-red-500 text-white text-center py-2 text-sm">
            🔌 Estás sin conexión. Intentando reconectar…
          </div>
        )}

        {/* Flujo limpio en callback/onboarding: sin chrome global para evitar parpadeos visuales */}
        {!isDashboardOrAdmin && !isAuthFlowRoute && (
          <Navbar userId={userId ?? undefined} sessionLoading={sessionLoading} />
        )}

        <SonnerToaster richColors position="top-center" closeButton />
        <Toaster />

        {sessionLoading ? (
          <LoadingOverlay />
        ) : (
          <main className="flex-grow w-full m-0 p-0 scroll-smooth">
            {isAuthFlowRoute ? (
              children
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        )}

        {!isAuthFlowRoute && (
          <footer className="w-full border-t border-black/[.06] bg-[#f5f5f7] py-7 pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-[#6e6e73] md:pb-7 dark:border-white/[.08] dark:bg-[#09090b] dark:text-zinc-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 md:flex-row md:px-8">
              <div className="flex items-center gap-3">
                <Image
                  src="/icon.png"
                  alt="Logo StudyDocu"
                  width={34}
                  height={34}
                  priority
                  className="rounded-xl border border-black/[.06] bg-white p-0.5 shadow-sm dark:border-white/10"
                />
                <div>
                  <p className="font-semibold text-[#1d1d1f] dark:text-white">StudyDocu</p>
                  <p className="text-xs">IA académica para estudiantes</p>
                </div>
              </div>

              <nav
                aria-label="Enlaces del pie"
                className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm"
              >
                <Link
                  href="/sobre-nosotros"
                  className="transition hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  Sobre nosotros
                </Link>
                <Link
                  href="/servicios"
                  className="transition hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  Servicios
                </Link>
                <Link
                  href="/terminos"
                  className="transition hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  Términos
                </Link>
                <Link
                  href="/privacidad"
                  className="transition hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  Privacidad
                </Link>
                <Link
                  href="/contacto"
                  className="transition hover:text-[#1d1d1f] dark:hover:text-white"
                >
                  Contacto
                </Link>
              </nav>

              <p className="text-center text-xs md:text-right">
                © {new Date().getFullYear()} StudyDocu · Ecuador
              </p>
            </div>
          </footer>
        )}

        {!isAuthFlowRoute && <MobileDock />}
      </div>
    </ToastProvider>
  )
}
