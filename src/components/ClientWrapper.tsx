'use client'

import { useEffect, useState } from 'react'
import { Session, AuthChangeEvent } from '@supabase/supabase-js'
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

const LoadingOverlay = dynamic(() => import('@/components/ui/LoadingOverlay'), { ssr: false })

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)

  const pathname = usePathname() ?? ''

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

        {/* ✅ Mostrar navbar solo fuera de dashboard/admin */}
        {!pathname.startsWith('/dashboard') && !pathname.startsWith('/admin') && (
          <Navbar userId={userId ?? undefined} sessionLoading={sessionLoading} />
        )}

        <SonnerToaster richColors position="top-center" closeButton />
        <Toaster />

        {sessionLoading ? (
          <LoadingOverlay />
        ) : (
          <main className="flex-grow w-full m-0 p-0 scroll-smooth">
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
          </main>
        )}

        <footer className="w-full text-muted-foreground border-t border-border bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Logo StudyDocu" className="h-10 w-10 rounded-md shadow" />
              <span className="text-lg font-bold text-gray-800 dark:text-white">StudyDocu</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/sobre-nosotros" className="hover:text-primary transition">
                Sobre nosotros
              </Link>
              <Link href="/terminos" className="hover:text-primary transition">
                Términos
              </Link>
              <Link href="/privacidad" className="hover:text-primary transition">
                Privacidad
              </Link>
              <Link href="/contacto" className="hover:text-primary transition">
                Contacto
              </Link>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center lg:text-right">
              <p>
                © {new Date().getFullYear()}{' '}
                <span className="font-semibold text-primary">StudyDocu</span>
              </p>
              <p>Hecho con 💙 por estudiantes para estudiantes</p>
            </div>
          </div>
        </footer>

        <MobileDock />
      </div>
    </ToastProvider>
  )
}
