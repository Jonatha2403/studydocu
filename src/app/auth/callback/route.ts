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
  const type = url.searchParams.get('type') // p.ej. 'recovery', 'signup', 'magiclink', 'oauth'
  const rawNext = url.searchParams.get('next') ?? '/'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/'

  // Si no viene "code"
  if (!code) {
    // En recuperación sin code → mandamos a pedir nuevo correo
    if (type === 'recovery') {
      return NextResponse.redirect(
        new URL('/auth/reset-password?error=missing_code', origin)
      )
    }

    // En otros casos, simplemente vamos a "next"
    return NextResponse.redirect(new URL(next, origin))
  }

  // 👉 A dónde redirigimos DESPUÉS de crear la sesión
  const redirectPath =
    type === 'recovery'
      ? '/auth/reset-password' // siempre aquí para cambiar contraseña
      : next

  const response = NextResponse.redirect(new URL(redirectPath, origin))

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

  // 🔑 Aquí SÍ intercambiamos el código por sesión
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  )

  if (exchangeError) {
    console.error('[AUTH_CALLBACK] Error en exchangeCodeForSession:', exchangeError)

    // Si falla en modo recuperación
    if (type === 'recovery') {
      return NextResponse.redirect(
        new URL('/auth/reset-password?error=token', origin)
      )
    }

    // Si falla en OAuth / otros
    return NextResponse.redirect(
      new URL('/iniciar-sesion?error=auth_callback', origin)
    )
  }

  // Si todo va bien, ya hay cookies de sesión y redirigimos
  return response
}
