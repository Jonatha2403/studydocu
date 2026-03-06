// ✅ Archivo: /middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Rutas públicas (NO poner '/' aquí; se chequea aparte)
const PUBLIC_ROUTES = new Set([
  '/iniciar-sesion', // login
  '/registrarse',
  '/verificado',
  '/explorar',
  '/error',
  '/unauthorized',
  '/upgrade',
  '/favicon.ico',
  '/manifest.json',

  // 🔐 Recuperación de contraseña (NUEVO + compatibilidad)
  '/auth/callback', // ✅ necesario para exchange + redirect
  '/auth/cambiar-clave', // ✅ nueva ruta para cambiar clave
  '/auth/send-reset', // ✅ si existe tu pantalla/endpoint para pedir enlace
  '/auth/reset-password', // antigua
  '/reset-password', // antigua
])

const AUTH_PAGES = new Set(['/iniciar-sesion', '/registrarse'])

// Rutas protegidas (requieren sesión)
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/perfil',
  '/subir',
  '/mi-tablero',
  '/documento',
  '/favoritos',
  '/vista-previa',
  '/admin', // /admin también pasa por el middleware
]

// Endpoints de API protegidos
const PROTECTED_API_PREFIXES = ['/api/download', '/api/admin']

// Rutas excluidas del bloqueo de onboarding
const ONBOARDING_SAFE_ROUTES = new Set(['/onboarding'])

const pathStartsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(p + '/'))

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl
  const pathname = url.pathname

  // Si OAuth vuelve por error al root con ?code=..., reenviar al callback correcto.
  if (pathname === '/' && url.searchParams.has('code')) {
    const cb = new URL('/auth/callback', req.url)
    cb.search = url.search
    return NextResponse.redirect(cb)
  }

  // Si ya está autenticado, no debe quedarse en login/registro.
  if (AUTH_PAGES.has(pathname)) {
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete,intereses')
        .eq('id', user.id)
        .maybeSingle()
      const onboardingComplete: boolean | undefined = profile?.onboarding_complete
      const hasIntereses =
        Array.isArray(profile?.intereses) &&
        profile.intereses.some((v: unknown) => String(v ?? '').trim().length > 0)

      if (onboardingComplete === true && hasIntereses) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  // 1) Permitir root y rutas públicas/estáticas básicas
  if (pathname === '/') return res
  if (PUBLIC_ROUTES.has(pathname)) return res

  // 2) ¿Ruta protegida (pages) o API protegida?
  const isProtectedPage = pathStartsWithAny(pathname, PROTECTED_PREFIXES)
  const isProtectedApi = pathStartsWithAny(pathname, PROTECTED_API_PREFIXES)

  if (!isProtectedPage && !isProtectedApi) {
    // No es una ruta que controlemos aquí
    return res
  }

  // 3) Obtener usuario desde cookies (Supabase Middleware)
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4) Si no hay sesión → redirigir a iniciar-sesion con callback
  if (!user) {
    const loginUrl = new URL('/iniciar-sesion', req.url)
    const callback = pathname + (url.search || '')
    loginUrl.searchParams.set('callbackUrl', callback)
    return NextResponse.redirect(loginUrl)
  }

  // 5) Reglas adicionales (admin / premium / onboarding)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role,subscription_status,onboarding_complete,intereses')
    .eq('id', user.id)
    .maybeSingle()

  const role: string | undefined = profile?.role || user.user_metadata?.role
  const subscription_status: string | undefined =
    profile?.subscription_status || user.user_metadata?.subscription_status
  const onboarding_complete: boolean | undefined = profile?.onboarding_complete
  const hasIntereses =
    Array.isArray(profile?.intereses) &&
    profile.intereses.some((v: unknown) => String(v ?? '').trim().length > 0)

  // 5a) Admin gate
  if (pathname.startsWith('/admin') && role !== 'admin') {
    const unauth = new URL('/unauthorized', req.url)
    return NextResponse.redirect(unauth)
  }

  // 5b) Premium gate
  const sub = (subscription_status || '').toLowerCase()
  const isPremium = sub === 'activa' || sub === 'premium'

  if (
    pathStartsWithAny(pathname, ['/premium', '/documentos-premium', '/asesoria-premium']) &&
    !isPremium
  ) {
    const upgrade = new URL('/upgrade', req.url)
    return NextResponse.redirect(upgrade)
  }

  // 5c) Onboarding gate (solo para páginas protegidas, no APIs)
  if (
    isProtectedPage &&
    !ONBOARDING_SAFE_ROUTES.has(pathname) &&
    (onboarding_complete !== true || !hasIntereses)
  ) {
    const ob = new URL('/onboarding', req.url)
    ob.searchParams.set('callbackUrl', pathname + (url.search || ''))
    return NextResponse.redirect(ob)
  }

  // 6) OK
  return res
}

// 👇 Importante: aquí incluimos explícitamente /api/download
export const config = {
  matcher: [
    // Páginas (excluye assets y _next)
    '/((?!_next|static|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)).*)',
    // APIs protegidas
    '/api/download/:path*',
  ],
}
