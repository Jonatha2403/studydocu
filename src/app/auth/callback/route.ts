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
  const error = url.searchParams.get('error') // posible error desde Supabase
  const rawNext = url.searchParams.get('next') ?? '/'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/'

  // ⚠️ 1) LINK DE RECUPERACIÓN DE CONTRASEÑA
  // Aquí NO intercambiamos sesión. Solo redirigimos a /auth/reset-password,
  // pasándole el code, type=recovery y cualquier error.
  if (type === 'recovery') {
    const redirectUrl = new URL('/auth/reset-password', origin)

    if (code) {
      redirectUrl.searchParams.set('code', code)
      redirectUrl.searchParams.set('type', 'recovery')
    }

    if (error) {
      redirectUrl.searchParams.set('error', error)
    }

    // Si el link de Supabase vino con "next", lo reenviamos también (opcional)
    if (rawNext) {
      redirectUrl.searchParams.set('next', encodeURIComponent(next))
    }

    return NextResponse.redirect(redirectUrl)
  }

  // ⚠️ 2) FLUJO NORMAL DE OAUTH (Google/GitHub, etc.)
  const response = NextResponse.redirect(new URL(next, origin))

  // Si no hay code → no es OAuth → redirigimos tal cual
  if (!code) {
    return response
  }

  // Manejo de cookies para crear la sesión OAuth
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
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  )

  if (exchangeError) {
    console.error('[AUTH_CALLBACK] Error al crear sesión OAuth:', exchangeError)
    return NextResponse.redirect(
      new URL('/iniciar-sesion?error=auth_callback', origin)
    )
  }

  return response
}
