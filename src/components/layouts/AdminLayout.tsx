'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useUserContext } from '@/context/UserContext'
import Sidebar from '@/components/Sidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { user, perfil, loading } = useUserContext()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Si no hay usuario, lo mandamos a iniciar sesión
        router.replace('/iniciar-sesion')
      } else if (perfil?.role !== 'admin') {
        // Si está logueado pero no es admin, lo mandamos al dashboard normal
        router.replace('/dashboard')
      }
    }
  }, [loading, user, perfil, router])

  // Mientras carga info del usuario/perfil
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  // Si ya cargó y no tiene acceso
  if (!user || perfil?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="h-10 w-10 text-red-500" />
          <h2 className="text-lg font-semibold">Acceso denegado</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            No tienes permisos para acceder al panel de administración.
          </p>
        </div>
      </div>
    )
  }

  // Layout normal para admins
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  )
}
