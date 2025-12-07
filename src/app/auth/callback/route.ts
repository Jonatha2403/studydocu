// src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  // next viene desde el email -> /reset-password
  const rawNext = url.searchParams.get('next') ?? '/reset-password'
  const decodedNext = decodeURIComponent(rawNext)
  const next = decodedNext.startsWith('/') ? decodedNext : '/reset-password'

  const origin = url.origin
  const response = NextResponse.redirect(new URL(next, origin))

  // Necesario para que Supabase maneje cookies correctamente
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

  // Si no viene un código, error
  if (!code) {
    return NextResponse.redirect(
      new URL('/reset-password?error=no_code', origin)
    )
  }

  // Intercambiar el código por una sesión temporal
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[AUTH_CALLBACK] Error al crear la sesión:', error)
    return NextResponse.redirect(
      new URL('/reset-password?error=no_session_after_exchange', origin)
    )
  }

  // Si todo salió bien, redirige a /reset-password
  return response
}
