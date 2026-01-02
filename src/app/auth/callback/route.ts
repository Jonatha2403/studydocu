// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const origin = url.origin

  const code = url.searchParams.get('code')
  const type = url.searchParams.get('type') // recovery | signup | magiclink
  const error = url.searchParams.get('error')

  /**
   * ⚠️ IMPORTANTE
   * En recovery IGNORAMOS cualquier "next"
   * para evitar que Supabase mande al dashboard
   */
  const rawNext = url.searchParams.get('next')
  const safeNext = rawNext && rawNext.startsWith('/') ? rawNext : '/'

  // ❌ Sin code → nada que intercambiar
  if (!code) {
    const fallback = new URL('/iniciar-sesion', origin)
    if (error) fallback.searchParams.set('error', error)
    return NextResponse.redirect(fallback)
  }

  /**
   * ✅ REDIRECCIÓN FINAL
   * recovery  → /auth/cambiar-clave
   * normal    → next o /
   */
  const redirectTarget = type === 'recovery' ? '/auth/cambiar-clave?type=recovery' : safeNext

  const response = NextResponse.redirect(new URL(redirectTarget, origin))

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            maxAge: 0,
            path: '/',
            ...options,
          })
        },
      },
    }
  )

  /**
   * 🔥 PASO MÁS IMPORTANTE
   * Intercambiar el code por sesión (OBLIGATORIO)
   * incluso en recovery
   */
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[AUTH_CALLBACK] exchangeCodeForSession error:', exchangeError)

    const fail = new URL('/iniciar-sesion', origin)
    fail.searchParams.set('error', 'auth_callback')
    return NextResponse.redirect(fail)
  }

  return response
}
