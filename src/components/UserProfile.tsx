'use client'

import { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { User as SupabaseUser } from '@supabase/supabase-js'
import {
  Loader2,
  Edit3,
  Save,
  XCircle,
  UserCog,
  CheckCircle,
  ShieldQuestion,
  AlertTriangle,
} from 'lucide-react'

interface ProfileData {
  id: string
  email?: string
  role?: string | null
  points?: number | null
  subscription_?: boolean | null
  username?: string | null
}

interface UserProfileEditProps {
  user: SupabaseUser
}

export default function UserProfileEdit({ user }: UserProfileEditProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false)
      setProfile(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, role, points, subscription_, username')
        .eq('id', user.id)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Perfil no encontrado. Podría necesitar ser creado.')
          setProfile(null)
          setOriginalProfileData(null)
        } else {
          throw fetchError
        }
      } else {
        const fullProfileData = { ...data, email: user.email, id: user.id }
        setProfile(fullProfileData)
        setOriginalProfileData(fullProfileData)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching profile:', err)
      setError('❌ No se pudo cargar el perfil.')
      toast.error('Error al cargar perfil', { description: message })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleInputChange = <T extends keyof ProfileData>(field: T, value: ProfileData[T]) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSubscriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => (prev ? { ...prev, subscription_: e.target.checked } : null))
    if (!editing && profile) {
      setEditing(true)
    }
  }

  const handleEdit = () => {
    setOriginalProfileData(profile)
    setEditing(true)
  }

  const handleCancel = () => {
    setProfile(originalProfileData)
    setEditing(false)
  }

  const handleSave = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault()
      if (!profile || !user) return

      setIsSaving(true)
      try {
        const updates: Partial<ProfileData> = {
          subscription_: profile.subscription_,
          username: profile.username,
          role: profile.role,
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)

        if (updateError) throw updateError

        toast.success('✅ Perfil actualizado correctamente.')
        setEditing(false)
        setOriginalProfileData(profile)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        console.error('Error updating profile:', err)
        toast.error('❌ Error al actualizar el perfil.', { description: message })
      } finally {
        setIsSaving(false)
      }
    },
    [profile, user]
  ) // ✅ originalProfileData eliminado

  if (loading) {
    return (
      <div className="mt-6 p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
        Cargando perfil...
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="mt-6 p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-md text-red-700 dark:text-red-300 text-center shadow-sm">
        <AlertTriangle className="inline-block w-5 h-5 mr-2" />
        {error}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mt-6 p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm text-center text-sm text-gray-500 dark:text-gray-400">
        <ShieldQuestion className="inline-block w-5 h-5 mr-2" />
        No se encontró información del perfil o aún no ha sido creado.
      </div>
    )
  }

  const displayEmail = user.email || profile.email || 'No disponible'

  return (
    <div className="mt-6 p-4 sm:p-6 bg-white dark:bg-gray-800/90 backdrop-blur-sm border dark:border-gray-700 rounded-xl shadow-xl space-y-4 text-sm selection:bg-blue-100 dark:selection:bg-yellow-700">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b dark:border-gray-700">
        <UserCog className="w-7 h-7 text-blue-600 dark:text-yellow-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mi Perfil</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Email:</span>
          <p className="text-gray-800 dark:text-gray-200 break-all">{displayEmail}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Rol:</span>
          {editing ? (
            <input
              type="text"
              value={profile.role || ''}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="text-gray-800 dark:text-gray-200 capitalize">
              {profile.role || 'No asignado'}
            </p>
          )}
        </div>
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Puntos:</span>
          <p className="text-gray-800 dark:text-gray-200">
            {profile.points?.toLocaleString() || 0}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-500 dark:text-gray-400">Username:</span>
          {editing ? (
            <input
              type="text"
              value={profile.username || ''}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="text-gray-800 dark:text-gray-200">{profile.username || 'No asignado'}</p>
          )}
        </div>

        <div className="sm:col-span-2 mt-2">
          <label
            htmlFor="subscription_checkbox"
            className="flex items-center gap-2 cursor-pointer w-fit"
          >
            <input
              type="checkbox"
              id="subscription_checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-yellow-500"
              checked={profile.subscription_ || false}
              onChange={handleSubscriptionChange}
              disabled={isSaving}
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Suscripción Activa
              {profile.subscription_ ? (
                <CheckCircle className="inline-block w-4 h-4 ml-1 text-green-500" />
              ) : (
                <XCircle className="inline-block w-4 h-4 ml-1 text-red-500" />
              )}
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 text-white rounded-md text-sm font-semibold disabled:opacity-60 transition-opacity"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="w-full sm:w-auto text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm underline px-4 py-2 rounded-md disabled:opacity-60"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-blue-600 dark:text-yellow-400 hover:text-blue-700 dark:hover:text-yellow-500 text-sm font-semibold underline focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-yellow-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 px-1 py-0.5 rounded"
          >
            <Edit3 size={14} />
            Editar Perfil
          </button>
        )}
      </div>
    </div>
  )
}
