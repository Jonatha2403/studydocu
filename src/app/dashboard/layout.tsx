// src/app/dashboard/layout.tsx
'use client'
import NotificationPanel from '@/components/NotificationPanel'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import SidebarDashboard from '@/components/SidebarDashboard'

import { Loader2, LogOut, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useUserContext } from '@/context/UserContext'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { perfil, user, loading } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    console.log('PERFIL:', perfil)
  }, [perfil])

  // 🔐 Si terminó de cargar y NO hay usuario → mandar a /iniciar-sesion
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/iniciar-sesion')
    }
  }, [loading, user, router])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      localStorage.removeItem('perfil')
      toast.success('Sesión cerrada correctamente.')
      router.push('/iniciar-sesion')
    } else {
      toast.error('Error al cerrar sesión.')
    }
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-gray-700 dark:text-gray-100">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-500" />
        <p className="text-lg font-medium mt-3">Cargando tu panel...</p>
      </div>
    )
  }

  // 🧩 Caso raro: hay user pero no perfil (o el contexto falló)
  if (!perfil) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-gray-700 dark:text-gray-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">No se pudo cargar tu perfil.</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Intenta refrescar la página o vuelve a iniciar sesión.
            </p>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/iniciar-sesion">Iniciar sesión</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/registrarse">Crear cuenta</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      {/* 🧭 Sidebar */}
      <SidebarDashboard />

      {/* 🧩 CONTENIDO PRINCIPAL */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 pt-0">
        {/* 🔝 Barra superior */}
        <div className="w-full flex justify-end items-center mb-6">
          <div className="flex items-center gap-3">
            {/* 🔔 Notificaciones */}
            <NotificationPanel userId={user?.id ?? null} />

            {/* ⬆ Subir documento */}
            <Link href="/subir">
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <UploadCloud className="w-4 h-4" />
                Subir Documento
              </Button>
            </Link>

            {/* 🚪 Cerrar sesión */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* 📄 Contenido de las páginas */}
        <div className="w-full pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
