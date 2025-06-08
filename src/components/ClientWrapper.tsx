'use client'

import { useEffect, useState } from 'react'
import { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Toaster as SonnerToaster } from 'sonner'
import Navbar from '@/components/layouts/Navbar'
import { ToastProvider } from '@/context/ToastContext'
import Toaster from '@/components/ui/Toaster' // ✅ default import corregido

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchSession = async () => {
      const { data, error }: { data: { session: Session | null }; error: Error | null } =
        await supabase.auth.getSession()

      if (!mounted) return
      if (error) console.error('❌ Error al obtener sesión:', error.message)

      setUserId(data.session?.user?.id ?? null)
      setSessionLoading(false)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (mounted) {
          setUserId(session?.user?.id ?? null)
          setSessionLoading(false)
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

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Navbar userId={userId} sessionLoading={sessionLoading} /> {/* ✅ props correctos */}
        <SonnerToaster richColors position="top-center" closeButton />
        <Toaster />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="w-full text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 py-6 border-t border-gray-200 dark:border-gray-700">
          © {new Date().getFullYear()} StudyDocu. Todos los derechos reservados.
        </footer>
      </div>
    </ToastProvider>
  )
}
