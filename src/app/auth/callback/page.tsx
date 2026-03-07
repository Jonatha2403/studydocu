'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const hasAnyInterests = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.some((v) => String(v ?? '').trim().length > 0)
  }
  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw || raw === '[]' || raw === '{}' || raw === 'null') return false
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.some((v) => String(v ?? '').trim().length > 0)
      }
      return false
    } catch {
      return raw.split(',').some((v) => v.trim().length > 0)
    }
  }
  return false
}

const isOnboardingReady = (
  profile: {
    onboarding_complete?: boolean
    intereses?: unknown
  } | null
) => {
  if (!profile) return false
  return profile.onboarding_complete === true && hasAnyInterests(profile.intereses)
}

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
        const next = rawNext.startsWith('/') && rawNext !== '/' ? rawNext : '/dashboard'

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
            const msg = (exErr.message || '').toLowerCase()
            const isPkceVerifierError =
              msg.includes('code verifier') || msg.includes('both auth code and code verifier')

            // Fallback: en algunos flujos OAuth la sesión ya está creada aunque falle el exchange PKCE.
            if (isPkceVerifierError) {
              const { data: sessionData } = await supabase.auth.getSession()
              if (sessionData?.session) {
                hardRedirect(next)
                return
              }
            }

            const reason = encodeURIComponent(exErr.message || 'exchange_failed')
            hardRedirect(`/iniciar-sesion?error=auth_callback&reason=${reason}`)
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
                const reason = encodeURIComponent(setErr.message || 'set_session_failed')
                hardRedirect(`/iniciar-sesion?error=auth_callback&reason=${reason}`)
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
          hardRedirect('/onboarding')
          return
        }

        // Regla global: si no completó onboarding, enviarlo a preguntas antes del dashboard.
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id,onboarding_complete,intereses')
            .eq('id', user.id)
            .maybeSingle()

          if (!profile) {
            const usernameBase =
              String(user.user_metadata?.username || user.email?.split('@')[0] || 'user')
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, '')
                .slice(0, 20) || 'user'

            await supabase.from('profiles').insert({
              id: user.id,
              email: user.email ?? null,
              username: `${usernameBase}_${user.id.slice(0, 6)}`,
              nombre_completo: user.user_metadata?.nombre_completo ?? null,
              role: user.user_metadata?.role ?? 'estudiante',
              points: 0,
              subscription_active: false,
              onboarding_complete: false,
              created_at: new Date().toISOString(),
            })

            hardRedirect('/onboarding')
            return
          }

          if (!isOnboardingReady(profile as any)) {
            hardRedirect('/onboarding')
            return
          }
        }

        // default
        hardRedirect(next)
      } catch (e) {
        console.error('[AUTH_CALLBACK] fatal:', e)
        const reason = encodeURIComponent((e as Error)?.message || 'fatal_callback_error')
        hardRedirect(`/iniciar-sesion?error=auth_callback&reason=${reason}`)
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
