'use client'

import AdminLayout from '@/components/layouts/AdminLayout'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Ban } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        setUserRole(null)
        setLoading(false)
        return
      }

      const currentUser = session.user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        setUserRole(profile?.role || null)
        setLoading(false)
        return
      }

      setUserRole('admin')
    } catch (error) {
      console.error('Error general:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600" />
        <p className="text-lg">Cargando datos del administrador...</p>
      </div>
    )
  }

  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <Ban size={48} className="mb-4" />
        <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
        <p>No tienes permisos para ver esta página.</p>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto mt-10 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Panel de Administración</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Bienvenido, puedes comenzar a revisar estadísticas, usuarios y documentos.</p>
      </div>
    </AdminLayout>
  )
}
