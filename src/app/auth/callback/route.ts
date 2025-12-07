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

  // 1) ENLACES DE RECUPERACIÓN DE CONTRASEÑA (type=recovery)
  // Si por error Supabase envía el link a /auth/callback en vez de /auth/reset-password,
  // lo redirigimos manualmente a la página correcta, conservando el code.
  if (type === 'recovery') {
    const redirectUrl = new URL('/auth/reset-password', origin)

    if (code) {
      redirectUrl.searchParams.set('code', code)
      redirectUrl.searchParams.set('type', 'recovery')
    }

    return NextResponse.redirect(redirectUrl)
  }

  // 2) FLUJO NORMAL DE OAUTH (Google, GitHub, etc.)
  const rawNext = url.searchParams.get('next') ?? '/'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/'

  // Redirección base a donde queramos llevar al usuario después del login
  const response = NextResponse.redirect(new URL(next, origin))

  // Si no viene código, no hay nada que intercambiar: solo redirigimos a "next"
  if (!code) {
    return response
  }

  // Necesario para que Supabase maneje las cookies de sesión correctamente
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

  // Intercambiamos el código por una sesión (solo para OAuth, NO para recovery)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[AUTH_CALLBACK] Error al crear la sesión:', error)
    // Si falla, lo mandamos al login con un mensaje genérico
    return NextResponse.redirect(
      new URL('/iniciar-sesion?error=auth_callback', origin)
    )
  }

  // Si todo salió bien, usamos la redirección a "next"
  return response
}
