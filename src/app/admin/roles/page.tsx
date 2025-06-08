'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import Auth from '@/components/Auth'
import AdminRoleManager from '@/components/AdminRoleManager'
import type { User } from '@supabase/supabase-js'

export default function AdminRolesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single()

        if (!error) {
          setRole(profile?.role ?? null)
        }
      }

      setLoading(false)
    }

    fetchSessionAndRole()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span>Cargando usuario...</span>
      </div>
    )
  }

  if (!user) return <Auth />

  if (role !== 'admin') {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        🚫 Acceso denegado. Solo los administradores pueden ver esta página.
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">👥 Gestión de Roles</h1>
      <AdminRoleManager />
    </main>
  )
}
