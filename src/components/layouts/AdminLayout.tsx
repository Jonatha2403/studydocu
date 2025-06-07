'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useSession } from '@/hooks/useSession'
import Sidebar from '@/components/Sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, perfil, loading } = useSession()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (user && perfil?.role === 'admin') {
        setAuthorized(true)
      } else {
        setAuthorized(false)
        router.push('/') // redirige a home si no es admin
      }
    }
  }, [user, perfil, loading, router])

  if (loading || (user && !authorized)) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Verificando permisos de administrador...
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600 dark:text-red-400">
        <ShieldAlert className="w-10 h-10 mb-4" />
        <p className="text-xl font-bold">Acceso denegado</p>
        <p className="text-sm">No tienes permisos para acceder a esta sección.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
