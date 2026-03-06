'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    let cancelled = false
    const hardRedirect = (path: string) => {
      window.location.replace(path)
    }

    const run = async () => {
      try {
        const type = searchParams?.get('type') ?? null
        const code = searchParams?.get('code') ?? null
        const error = searchParams?.get('error') ?? null
        const rawNext = searchParams?.get('next') ?? '/dashboard'
        const next = rawNext.startsWith('/') ? rawNext : '/'

        if (error) {
          toast.error(error)
          hardRedirect('/iniciar-sesion?error=auth_callback')
          return
        }

        // 1) Si viene code (OAuth/PKCE)
        if (code) {
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(code)
          if (exErr) {
            console.error('[AUTH_CALLBACK] exchangeCodeForSession:', exErr)
            hardRedirect('/iniciar-sesion?error=auth_callback')
            return
          }
        } else {
          // 2) Si viene hash con tokens (#access_token=...&refresh_token=...)
          const hash = window.location.hash
          if (hash && hash.includes('access_token')) {
            const params = new URLSearchParams(hash.replace('#', ''))
            const access_token = params.get('access_token')
            const refresh_token = params.get('refresh_token')

            if (access_token && refresh_token) {
              const { error: setErr } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              })
              if (setErr) {
                console.error('[AUTH_CALLBACK] setSession:', setErr)
                hardRedirect('/iniciar-sesion?error=auth_callback')
                return
              }
            }
          }
        }

        if (cancelled) return

        // ✅ Ruteo final por tipo
        if (type === 'recovery') {
          hardRedirect('/auth/cambiar-clave?type=recovery')
          return
        }

        if (type === 'signup') {
          hardRedirect(next)
          return
        }

        // default
        hardRedirect(next)
      } catch (e) {
        console.error('[AUTH_CALLBACK] fatal:', e)
        hardRedirect('/iniciar-sesion?error=auth_callback')
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Validando enlace...</p>
    </div>
  )
}
