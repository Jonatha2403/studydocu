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
  const type = url.searchParams.get('type')

  // ⚠️ 1) LINK DE RECUPERACIÓN DE CONTRASEÑA
  // NO debemos intercambiar sesión aquí.
  if (type === 'recovery') {
    const redirectUrl = new URL('/auth/reset-password', origin)

    if (code) {
      redirectUrl.searchParams.set('code', code)
      redirectUrl.searchParams.set('type', 'recovery')
    }

    return NextResponse.redirect(redirectUrl)
  }

  // ⚠️ 2) FLUJO NORMAL DE OAUTH (Google/GitHub, etc.)
  const rawNext = url.searchParams.get('next') ?? '/'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/'

  const response = NextResponse.redirect(new URL(next, origin))

  // Si no hay code → no es OAuth → redirigir normal
  if (!code) {
    return response
  }

  // Manejo normal de cookies para OAuth login
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
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

  // INTERCAMBIAR SESIÓN SOLO PARA OAUTH
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[AUTH_CALLBACK] Error al crear sesión OAuth:', error)
    return NextResponse.redirect(
      new URL('/iniciar-sesion?error=auth_callback', origin)
    )
  }

  return response
}
