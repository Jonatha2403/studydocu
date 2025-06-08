import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons/|screenshots/|sw.js).*)',
  ],
  runtime: 'nodejs', // 🛡️ Ejecuta en Node.js, no en Edge
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    const pathname = req.nextUrl.pathname
    const isDev = process.env.NODE_ENV === 'development'
    const userIP =
      (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'IP desconocida'

    if (isDev) {
      console.log(`[🛰️ MIDDLEWARE] Ruta: ${pathname} | IP: ${userIP} | Auth: ${!!session}`)
    }

    if (sessionError) {
      console.error('❌ Error al obtener sesión:', sessionError.message)
    }

    const protectedRoutes = ['/admin', '/perfil', '/subir/documentos']
    const premiumRoutes = ['/premium-area', '/documentos-premium', '/asesoria-premium']
    const requiresAuth = [...protectedRoutes, ...premiumRoutes].some((path) =>
      pathname.startsWith(path)
    )

    // 🔐 Redirige si no hay sesión y es ruta protegida
    if (requiresAuth && !session) {
      const loginUrl = new URL('/auth?modo=login', req.url)
      loginUrl.searchParams.set('redirectedFrom', pathname)
      if (isDev) console.warn(`[🔐 ACCESO BLOQUEADO] No autenticado → ${pathname}`)
      return NextResponse.redirect(loginUrl)
    }

    // ✅ Validaciones si hay sesión
    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_complete, subscription_status, role')
        .eq('id', session.user.id)
        .single()

      if (!profileError && profile) {
        // 🧩 Perfil incompleto
        if (!profile.is_complete && pathname !== '/completar-perfil') {
          return NextResponse.redirect(new URL('/completar-perfil', req.url))
        }

        // ⏳ Suscripción expirada
        if (profile.subscription_status === 'expired' && pathname !== '/suscripcion') {
          return NextResponse.redirect(new URL('/suscripcion', req.url))
        }

        // 🌟 Premium
        if (premiumRoutes.some((path) => pathname.startsWith(path))) {
          const { data: membership } = await supabase
            .from('user_memberships')
            .select('plan, expires_at')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .single()

          const isPremium =
            membership?.plan === 'premium' &&
            (!membership.expires_at || new Date(membership.expires_at) > new Date())

          if (!isPremium) {
            if (isDev) console.warn(`[🚫 PREMIUM] Usuario sin plan válido → ${pathname}`)
            return NextResponse.redirect(new URL('/no-autorizado', req.url))
          }
        }

        // 👑 Admin
        if (pathname.startsWith('/admin') && profile.role !== 'admin') {
          if (isDev)
            console.warn(
              `[⛔ ADMIN] Usuario no autorizado (${session.user.id}, rol: ${profile.role})`
            )
          return NextResponse.redirect(new URL('/', req.url))
        }
      } else {
        console.warn(`[⚠️ PERFIL] No se pudo cargar perfil:`, profileError?.message)
      }
    }

    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('❌ Error inesperado en middleware:', message)
    return res // No bloquear la app en caso de fallo inesperado
  }
}
