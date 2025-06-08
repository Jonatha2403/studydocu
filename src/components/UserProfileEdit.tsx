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
  ShieldCheck,
  Award,
  Mail,
  ShieldQuestion,
  CheckCircle,
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
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setOriginalProfileData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setFetchError(null)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, points, subscription_, username')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          const baseProfile: ProfileData = {
            id: user.id,
            email: user.email,
            role: 'user',
            points: 0,
            subscription_: false,
            username: user.user_metadata?.username || user.email?.split('@')[0] || 'Usuario',
          }
          setProfile(baseProfile)
          setOriginalProfileData(baseProfile)
        } else {
          throw error
        }
      } else {
        const fullProfileData: ProfileData = { ...data, email: user.email, id: user.id }
        setProfile(fullProfileData)
        setOriginalProfileData(fullProfileData)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error fetching profile:', err)
      setFetchError('❌ No se pudo cargar la información del perfil.')
      toast.error('Error al cargar perfil', { description: message })
      setProfile(null)
      setOriginalProfileData(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSubscriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!profile) return
    if (!editing) {
      setOriginalProfileData(profile)
      setEditing(true)
    }
    setProfile({ ...profile, subscription_: e.target.checked })
  }

  const handleEditClick = () => {
    if (profile) setOriginalProfileData(profile)
    setEditing(true)
  }

  const handleCancelClick = () => {
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
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)

        if (updateError) throw updateError

        toast.success('✅ Suscripción actualizada correctamente.')
        setEditing(false)
        setOriginalProfileData(profile)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        console.error('Error updating profile:', err)
        toast.error('❌ Error al actualizar la suscripción.', { description: message })
      } finally {
        setIsSaving(false)
      }
    },
    [profile, user]
  )

  if (loading) {
    return (
      <div className="mt-6 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md text-center text-sm text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin inline-block w-5 h-5 mr-2" />
        Cargando perfil...
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="mt-6 p-4 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 text-center shadow-md">
        <AlertTriangle className="inline-block w-5 h-5 mr-2" />
        {fetchError}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mt-6 p-4 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-md text-center text-sm text-gray-500 dark:text-gray-400">
        <ShieldQuestion className="inline-block w-5 h-5 mr-2" />
        No se encontró información del perfil.
      </div>
    )
  }

  const displayEmail = profile.email || user.email || 'No disponible'

  return (
    <div className="mt-6 p-4 sm:p-6 bg-white dark:bg-gray-800/90 backdrop-blur-sm border dark:border-gray-700 rounded-xl shadow-xl space-y-4 text-sm selection:bg-blue-100 dark:selection:bg-yellow-700">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b dark:border-gray-600">
        <UserCog className="w-8 h-8 text-blue-600 dark:text-yellow-400 shrink-0" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mi Perfil</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gestiona tu información y suscripción.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex items-start gap-2">
          <Mail size={16} className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400 block">Email:</span>
            <p className="text-gray-800 dark:text-gray-200 break-all">{displayEmail}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400 block">Rol:</span>
            <p className="text-gray-800 dark:text-gray-200 capitalize">
              {profile.role || 'No asignado'}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Award size={16} className="text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
          <div>
            <span className="font-medium text-gray-500 dark:text-gray-400 block">Puntos:</span>
            <p className="text-gray-800 dark:text-gray-200">
              {profile.points?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="md:col-span-2 mt-2 pt-4 border-t dark:border-gray-700"
        >
          <label
            htmlFor="subscription_checkbox"
            className="flex items-center gap-2 cursor-pointer w-fit mb-3"
          >
            <input
              type="checkbox"
              id="subscription_checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-yellow-500 dark:checked:border-yellow-500"
              checked={profile.subscription_ || false}
              onChange={handleSubscriptionChange}
              disabled={isSaving}
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">Suscripción Activa</span>
            {profile.subscription_ ? (
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            )}
          </label>

          {editing ? (
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-900 text-white rounded-md text-sm font-semibold disabled:opacity-60 transition-opacity"
              >
                {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                {isSaving ? 'Guardando...' : 'Guardar Suscripción'}
              </button>
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={isSaving}
                className="w-full sm:w-auto text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm underline px-4 py-2 rounded-md disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEditClick}
              className="flex items-center gap-2 text-blue-600 dark:text-yellow-400 hover:text-blue-700 dark:hover:text-yellow-500 text-sm font-semibold underline focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-yellow-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 px-1 py-0.5 rounded"
            >
              <Edit3 size={14} />
              Editar Suscripción
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
