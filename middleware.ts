// ✅ Archivo: /middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Rutas públicas (NO poner '/' aquí; se chequea aparte)
const PUBLIC_ROUTES = new Set([
  '/iniciar-sesion',   // 👈 login actual
  '/registrarse',
  '/verificado',
  '/verificado-oauth',
  '/explorar',
  '/error',
  '/unauthorized',
  '/upgrade',
  '/favicon.ico',
  '/manifest.json',
])

// Rutas protegidas (requieren sesión)
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/perfil',
  '/subir',
  '/mi-tablero',
  '/documento',
  '/favoritos',
  '/vista-previa', // 👈 protegida
  '/admin',        // 👈 AHORA /admin también pasa por el middleware
]

// Endpoints de API protegidos
const PROTECTED_API_PREFIXES = ['/api/download', '/api/admin']


// Rutas excluidas del bloqueo de onboarding
const ONBOARDING_SAFE_ROUTES = new Set(['/onboarding'])

// Helper
const pathStartsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(p + '/'))

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = req.nextUrl
  const pathname = url.pathname

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

  // 3) Obtener usuario desde cookies (sin validar JWT a mano)
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4) Si no hay sesión → redirigir a iniciar-sesion con callback
  if (!user) {
    const loginUrl = new URL('/iniciar-sesion', req.url)
    // conservar a dónde iba (path + query)
    const callback = pathname + (url.search || '')
    loginUrl.searchParams.set('callbackUrl', callback)
    return NextResponse.redirect(loginUrl)
  }

  // 5) Reglas adicionales (admin / premium / onboarding)

  // Traemos perfil para role, subscription_status y onboarding_complete
  const profileUrl = new URL(
    // 👇 usamos 'perfiles' para que coincida con tu tabla en Supabase
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/perfiles?select=role,subscription_status,onboarding_complete&id=eq.${user.id}`,
  )

  const profileRes = await fetch(profileUrl, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      Authorization: `Bearer ${req.cookies.get('sb-access-token')?.value || ''}`,
    },
  })

  const profile = (await profileRes.json())?.[0] || {}

  const role: string | undefined = profile.role || user.user_metadata?.role
  const subscription_status: string | undefined =
    profile.subscription_status || user.user_metadata?.subscription_status
  const onboarding_complete: boolean | undefined = profile.onboarding_complete

  // 5a) Admin gate
  if (pathname.startsWith('/admin') && role !== 'admin') {
    const unauth = new URL('/unauthorized', req.url)
    return NextResponse.redirect(unauth)
  }

  // 5b) Premium gate
  const isPremium =
    (subscription_status || '').toLowerCase() === 'activa' ||
    (subscription_status || '').toLowerCase() === 'premium'

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
    onboarding_complete === false
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
