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
  const type = url.searchParams.get('type') // "recovery" en reset
  const error = url.searchParams.get('error') ?? null

  const rawNext = url.searchParams.get('next') ?? '/'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/'

  // ✅ Si falta el code, no hay nada que intercambiar → manda a login
  if (!code) {
    const fallback = new URL('/iniciar-sesion', origin)
    if (error) fallback.searchParams.set('error', error)
    return NextResponse.redirect(fallback)
  }

  // ✅ Si es recovery, forzamos a cambiar clave (NO dashboard)
  const redirectTarget =
    type === 'recovery' ? '/auth/cambiar-clave' : next

  const response = NextResponse.redirect(new URL(redirectTarget, origin))

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

  // 🔥 CLAVE: también para recovery hacemos exchange en el servidor
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[AUTH_CALLBACK] Error al crear sesión:', exchangeError)
    const fail = new URL('/iniciar-sesion', origin)
    fail.searchParams.set('error', 'auth_callback')
    return NextResponse.redirect(fail)
  }

  return response
}
