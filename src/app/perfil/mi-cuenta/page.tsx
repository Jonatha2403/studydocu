'use client'

import { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Loader2,
  User2,
  Edit3,
  Save,
  ListChecks,
  ShieldCheck,
  Award,
  Mail,
  CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import type { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js'
import UserAchievements from '@/components/UserAchievements'

interface AuditLogDetail {
  file_name?: string
  category?: string
}

interface AuditLogEntry {
  id: string
  action: string
  details: AuditLogDetail | null
  created_at: string
}

interface UserProfile {
  id: string
  username: string | null
  avatar_url: string | null
  points: number | null
  role: string | null
  nombre: string | null
  carrera: string | null
  universidad: string | null
  subscription_status: 'Activa' | 'Inactiva' | string | null
  email?: string
  uploads_count?: number
  approved_count?: number
}

function HistorialAcciones({ userId }: { userId: string }) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('id, action, details, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      toast.error('Error al cargar historial.')
      return
    }

    setLogs(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  if (loading)
    return <p className="text-sm text-gray-500 dark:text-gray-400">Cargando historial...</p>
  if (logs.length === 0) return <p className="text-sm text-gray-400">Sin acciones registradas.</p>

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
        <ListChecks size={18} /> Historial de Acciones
      </h3>
      <ul className="space-y-2">
        {logs.map((log) => (
          <li key={log.id} className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
            <strong>{log.action.replace(/_/g, ' ')}</strong>
            {log.details?.file_name && <> — {log.details.file_name}</>}
            <div className="text-xs text-gray-500">
              {new Date(log.created_at).toLocaleString('es-EC')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function MiCuentaPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchUserData = useCallback(async (authUser: SupabaseUser) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error) {
      toast.error('Error al obtener perfil.')
      return
    }

    const profileData = { ...data, email: authUser.email } as UserProfile
    setProfile(profileData)
    setForm(profileData)
    setLoading(false)
  }, [])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) fetchUserData(currentUser)
      }
    )

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const currentUser = data.session?.user ?? null
      setUser(currentUser)
      if (currentUser) fetchUserData(currentUser)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [fetchUserData])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)

    const updates = {
      username: form.username,
      nombre: form.nombre,
      carrera: form.carrera,
      universidad: form.universidad,
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      toast.error('Error al actualizar perfil.')
    } else {
      toast.success('Perfil actualizado.')
      setProfile({ ...data, email: user.email } as UserProfile)
      setForm({ ...data, email: user.email })
      setIsEditing(false)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 dark:text-gray-400">
        <Loader2 className="animate-spin w-6 h-6 mb-4" />
        <p>Cargando perfil...</p>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="text-center mt-10">
        <User2 size={40} className="mx-auto mb-2" />
        <p>Debes iniciar sesión para ver tu cuenta.</p>
        <Link
          href="/auth?modo=login"
          className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Iniciar Sesión
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-2 border-blue-500 dark:border-yellow-400">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.username || ''} />
            <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Mail size={14} /> {user.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <ShieldCheck size={14} /> Rol: {profile.role}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Award size={14} /> Puntos: {profile.points}
            </p>
            <p
              className={`text-sm flex items-center gap-2 ${profile.subscription_status === 'Activa' ? 'text-green-600' : 'text-red-600'}`}
            >
              <CreditCard size={14} /> {profile.subscription_status}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="ml-auto px-4 py-2 text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Edit3 size={16} className="inline mr-1" /> Editar
          </button>
        </div>

        {isEditing && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-md"
          >
            {(['username', 'nombre', 'carrera', 'universidad'] as (keyof UserProfile)[]).map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm mb-1 capitalize">{field}</label>
                  <input
                    name={field}
                    value={form[field] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-700"
                  />
                </div>
              )
            )}
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                {saving ? (
                  'Guardando...'
                ) : (
                  <>
                    <Save size={16} className="inline mr-1" /> Guardar
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <UserAchievements userId={user.id} />
        <HistorialAcciones userId={user.id} />
      </div>
    </main>
  )
}
