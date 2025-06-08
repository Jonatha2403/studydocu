'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, ShieldAlert, UserCog } from 'lucide-react'

import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  role: string
}

export default function AdminRoleManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false)
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null)

  const initializeAdminData = useCallback(async (user: User) => {
    setCurrentUser(user)
    try {
      const { data: currentUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !currentUserProfile) {
        toast.error('❌ Error al verificar tu rol de administrador.')
        console.error('Current user profile fetch error:', profileError)
        setIsCurrentUserAdmin(false)
        setLoading(false)
        return
      }

      if (currentUserProfile.role !== 'admin') {
        toast.error('🚫 Acceso denegado. No tienes permisos de administrador.')
        setIsCurrentUserAdmin(false)
        setLoading(false)
        return
      }

      setIsCurrentUserAdmin(true)

      const { data: allProfilesData, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .order('email', { ascending: true })

      if (allProfilesError) {
        toast.error('❌ Error al cargar la lista de perfiles.')
        console.error('All profiles fetch error:', allProfilesError)
      } else {
        setProfiles(allProfilesData || [])
      }
    } catch (e) {
      const err = e as Error
      toast.error('❌ Ocurrió una excepción al inicializar.')
      console.error('Initialization exception:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    supabase.auth
      .getSession()
      .then(({ data: sessionData, error: sessionError }) => {
        if (sessionError) {
          toast.error('❌ Error al obtener la sesión actual.')
          console.error('Get session error:', sessionError)
          setLoading(false)
          return
        }
        const user = sessionData.session?.user
        if (user) {
          void initializeAdminData(user)
        } else {
          toast.error('🚫 Debes iniciar sesión para acceder a esta página.')
          setLoading(false)
        }
      })
      .catch((e) => {
        const err = e as Error
        toast.error('❌ Excepción al obtener la sesión.')
        console.error('Get session exception:', err)
        setLoading(false)
      })
  }, [initializeAdminData])

  const handleRoleChange = async (profileId: string, newRole: string) => {
    if (profileId === currentUser?.id) {
      const confirmSelfChange = window.confirm(
        'Estás a punto de cambiar tu propio rol. ¿Estás seguro? Esto podría afectar tu acceso de administrador.'
      )
      if (!confirmSelfChange) return
    }

    setUpdatingRoleId(profileId)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId)

      if (error) {
        toast.error(
          `❌ Error al actualizar el rol para ${profiles.find((p) => p.id === profileId)?.email || 'usuario'}.`
        )
        console.error('Role update error:', error)
      } else {
        setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, role: newRole } : p)))
        toast.success(
          `✅ Rol actualizado para ${profiles.find((p) => p.id === profileId)?.email || 'usuario'}.`
        )
      }
    } catch (e) {
      const err = e as Error
      toast.error('❌ Excepción al actualizar el rol.')
      console.error('Role update exception:', err)
    } finally {
      setUpdatingRoleId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px] text-gray-600 dark:text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 dark:text-yellow-400" />
        <p className="mt-3 text-lg">Cargando gestor de roles...</p>
      </div>
    )
  }

  if (!isCurrentUserAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[300px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto mt-10 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Acceso Denegado</h2>
        <p className="text-gray-600 dark:text-gray-300">
          No tienes los permisos necesarios para administrar roles de usuario. Por favor, contacta a
          un administrador.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl mx-auto mt-6">
      <header className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <UserCog size={28} className="text-blue-600 dark:text-yellow-400" /> Administrar Roles de
          Usuario
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Asigna o modifica los roles de los usuarios registrados en la plataforma.
        </p>
      </header>

      {profiles.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No hay perfiles para mostrar.
        </p>
      ) : (
        <ul className="space-y-3">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border dark:border-gray-700 p-3 rounded-md text-sm transition-colors duration-150
                ${
                  profile.id === currentUser?.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <div className="flex-grow mb-2 sm:mb-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{profile.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rol actual:{' '}
                  <span
                    className={`font-bold ${profile.role === 'admin' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                  >
                    {profile.role}
                  </span>
                  {profile.id === currentUser?.id && (
                    <span className="ml-1 text-xs font-normal text-blue-600 dark:text-blue-400">
                      (este es tu usuario)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {updatingRoleId === profile.id && (
                  <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
                )}
                <select
                  className="text-sm border border-gray-300 dark:border-gray-600 px-2 py-1.5 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-500 focus:border-blue-500 dark:focus:border-yellow-500 w-full sm:w-auto"
                  value={profile.role}
                  onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                  disabled={
                    updatingRoleId === profile.id ||
                    (profile.id === currentUser?.id &&
                      profile.role === 'admin' &&
                      profiles.filter((p) => p.role === 'admin').length <= 1)
                  }
                >
                  <option value="user">Usuario (user)</option>
                  <option value="admin">Administrador (admin)</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
