// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  // next viene URL-encoded desde el frontend: encodeURIComponent('/restablecer')
  const rawNext = url.searchParams.get('next') ?? '/restablecer'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/restablecer'

  const origin = url.origin

  // Redirección por defecto (después de crear la sesión)
  const response = NextResponse.redirect(new URL(next, origin))

  // 👇 En tu setup, cookies() devuelve una Promise → usar await
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
            ...options,
            path: '/',
            maxAge: 0,
          })
        },
      },
    }
  )

  if (!code) {
    return NextResponse.redirect(
      new URL('/restablecer?error=no_code', origin)
    )
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[AUTH_CALLBACK] Error al hacer exchangeCodeForSession:', error)
    return NextResponse.redirect(
      new URL('/restablecer?error=no_session_after_exchange', origin)
    )
  }

  // Si todo va bien, ya hay sesión válida y se redirige a /restablecer (o al next que mandaste)
  return response
}
