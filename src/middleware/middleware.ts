import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const userIP = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'IP no disponible'
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    console.log(`[ACCESO] Ruta: ${pathname} | IP: ${userIP} | Autenticado: ${!!session}`)
  }

  if (sessionError) {
    console.error('❌ Error al obtener la sesión en el middleware:', sessionError.message)
  }

  const protectedRoutes = ['/admin', '/perfil', '/subir/documentos']
  const premiumRoutes = ['/premium-area', '/documentos-premium', '/asesoria-premium']
  const requiresAuth = protectedRoutes.concat(premiumRoutes).some((path) => pathname.startsWith(path))

  // Si se requiere auth y no hay sesión → redirigir al login
  if (requiresAuth && !session) {
    const loginUrl = new URL('/auth?modo=login', req.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    if (isDev) console.warn(`[RESTRICCIÓN] Usuario no autenticado en ${pathname}`)
    return NextResponse.redirect(loginUrl)
  }

  // Si hay sesión, validar perfil, rol y membresía
  if (session) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_complete, subscription_status, role')
      .eq('id', session.user.id)
      .single()

    if (!profileError && profile) {
      // Redirigir si perfil incompleto
      if (!profile.is_complete && pathname !== '/completar-perfil') {
        return NextResponse.redirect(new URL('/completar-perfil', req.url))
      }

      // Redirigir si suscripción expirada
      if (profile.subscription_status === 'expired' && pathname !== '/suscripcion') {
        return NextResponse.redirect(new URL('/suscripcion', req.url))
      }

      // Validar acceso a rutas premium
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
          return NextResponse.redirect(new URL('/no-autorizado', req.url))
        }
      }

      // Validar acceso a rutas de administrador
      if (pathname.startsWith('/admin') && profile.role !== 'admin') {
        if (isDev) console.warn(`[DENEGADO] No admin (${session.user.id}, rol: ${profile.role})`)
        return NextResponse.redirect(new URL('/', req.url))
      }
    } else {
      console.warn(`[ERROR] No se pudo validar perfil de ${session.user.id}:`, profileError?.message)
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons/|screenshots/|sw.js).*)',
  ],
}
