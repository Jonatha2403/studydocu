'use client'

import NotificationPanel from '@/components/NotificationPanel'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'
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
    if (!loading && !user) {
      router.replace('/iniciar-sesion')
    }
  }, [loading, user, router])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      localStorage.removeItem('perfil')
      toast.success('Sesion cerrada correctamente.')
      router.push('/iniciar-sesion')
    } else {
      toast.error('Error al cerrar sesion.')
    }
  }

  if (loading) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-20 text-gray-700 dark:text-gray-100">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <p className="mt-3 text-lg font-medium">Cargando tu panel...</p>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 py-20 text-gray-700 dark:text-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-xl font-semibold">No se pudo cargar tu perfil.</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Intenta refrescar la pagina o vuelve a iniciar sesion.
            </p>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/iniciar-sesion">Iniciar sesion</Link>
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
    <div className="flex min-h-screen w-full bg-slate-50 text-gray-800 dark:bg-gray-950 dark:text-gray-100">
      <SidebarDashboard />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 border-b bg-white/90 px-3 py-3 backdrop-blur dark:bg-gray-950/80 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-end gap-2 sm:gap-3">
            <NotificationPanel userId={user?.id ?? null} />

            <Link href="/dashboard/subir" className="hidden sm:block">
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <UploadCloud className="h-4 w-4" />
                Subir documento
              </Button>
            </Link>

            <Link href="/dashboard/subir" className="sm:hidden">
              <Button variant="outline" size="icon" aria-label="Subir documento">
                <UploadCloud className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="hidden items-center gap-2 text-sm sm:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Button>

            <Button
              onClick={handleLogout}
              variant="destructive"
              size="icon"
              className="sm:hidden"
              aria-label="Cerrar sesion"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-2 pb-10 pt-4 sm:px-6 lg:px-8 lg:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
