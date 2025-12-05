// ✅ Rutas públicas accesibles sin login
export const RUTAS_PUBLICAS: string[] = [
  '/',
  '/explorar',
  '/servicios',
  '/blog',
  '/premium',
  '/auth',
  '/ingresar',
  '/registrarse',
  '/verificado',
]

// ✅ Rutas ignoradas en validación de perfil (como redirecciones o onboarding)
export const RUTAS_IGNORADAS: string[] = [
  '/verificado',
  '/registrarse',
  '/ingresar',
  '/auth',
]

// ✅ Rutas protegidas por suscripción premium activa
export const RUTAS_PREMIUM: string[] = [
  '/mi-tablero',
  '/asesores',
  '/calendario',
  '/premium/herramientas',
]

// ✅ Rutas exclusivas para administradores
export const RUTAS_ADMIN: string[] = [
  '/admin',
  '/admin/dashboard',
  '/admin/documentos',
  '/admin/usuarios',
]

// ✅ Rutas según roles específicos
export const RUTAS_ESTUDIANTE: string[] = [
  '/subir',
  '/logros',
  '/dashboard',
]

export const RUTAS_ASESOR: string[] = [
  '/asesor/solicitudes',
  '/asesor/dashboard',
]

// ✅ Rutas relacionadas con herramientas de IA
export const RUTAS_IA: string[] = [
  '/ia',
  '/ia/chat',
  '/ia/resumenes',
]

// ✅ Función: ¿requiere perfil cargado?
export function requierePerfil(path: string | null): boolean {
  if (!path) return false
  const publica = RUTAS_PUBLICAS.includes(path)
  const ignorada = RUTAS_IGNORADAS.some(r => path.startsWith(r))
  return !publica && !ignorada
}

// ✅ Función: ¿requiere suscripción premium?
export function requierePremium(path: string | null): boolean {
  if (!path) return false
  return RUTAS_PREMIUM.some(r => path.startsWith(r))
}

// ✅ Función: ¿es ruta exclusiva de admin?
export function esRutaAdmin(path: string | null): boolean {
  if (!path) return false
  return RUTAS_ADMIN.some(r => path.startsWith(r))
}

// ✅ Función: ¿es ruta exclusiva de estudiante?
export function esRutaEstudiante(path: string | null): boolean {
  if (!path) return false
  return RUTAS_ESTUDIANTE.some(r => path.startsWith(r))
}

// ✅ Función: ¿es ruta exclusiva de asesor?
export function esRutaAsesor(path: string | null): boolean {
  if (!path) return false
  return RUTAS_ASESOR.some(r => path.startsWith(r))
}

// ✅ Etiquetas por ruta (útil para menú, breadcrumbs, SEO)
export const NOMBRE_RUTA: Record<string, string> = {
  '/': 'Inicio',
  '/subir': 'Subir documento',
  '/explorar': 'Explorar documentos',
  '/servicios': 'Servicios académicos',
  '/blog': 'Blog educativo',
  '/dashboard': 'Mi perfil',
  '/logros': 'Logros',
  '/premium': 'Suscripción Premium',
  '/mi-tablero': 'Mi Tablero',
  '/calendario': 'Calendario',
  '/asesores': 'Asesores',
  '/admin/dashboard': 'Panel Admin',
  '/ia': 'IA Educativa',
}
