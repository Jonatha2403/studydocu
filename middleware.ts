// ✅ Archivo: /middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Rutas públicas (NO poner '/' aquí; se chequea aparte)
const PUBLIC_ROUTES = new Set([
  '/iniciar-sesion', // login
  '/registrarse',
  '/verificado',
  '/verificado-oauth',
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

  // ✅ Obtener access token real desde la sesión (NO depender de sb-access-token)
  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData.session?.access_token ?? ''

  // 5) Reglas adicionales (admin / premium / onboarding)

  // Traer perfil para role, subscription_status y onboarding_complete
  const profileUrl = new URL(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/perfiles?select=role,subscription_status,onboarding_complete&id=eq.${user.id}`,
  )

  const profileRes = await fetch(profileUrl, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      Authorization: `Bearer ${accessToken}`,
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
  const sub = (subscription_status || '').toLowerCase()
  const isPremium = sub === 'activa' || sub === 'premium'

  if (
    pathStartsWithAny(pathname, [
      '/premium',
      '/documentos-premium',
      '/asesoria-premium',
    ]) &&
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
