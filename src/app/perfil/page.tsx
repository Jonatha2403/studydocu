'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/hooks/useSession'

export default function PerfilPage() {
  const router = useRouter()
  const { user, perfil, loading } = useSession()
  const [saving, setSaving] = useState(false)
  const [localProfile, setLocalProfile] = useState(perfil)

  // Sincroniza el perfil cuando esté listo
  useState(() => {
    if (perfil) setLocalProfile(perfil)
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSave = async () => {
    if (!user || !localProfile) return toast.error("Usuario inválido")
    setSaving(true)
    try {
      const updates = {
        nombre: localProfile.nombre,
        carrera: localProfile.carrera,
        universidad: localProfile.universidad,
      }
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
      if (error) throw error
      toast.success("Perfil actualizado")
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error(error.message)
    else router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!user || !localProfile) {
    return <p className="text-center text-red-500">Inicia sesión para continuar.</p>
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mi Perfil</h1>
        <button onClick={handleLogout} className="text-red-500 hover:underline flex items-center gap-1">
          <LogOut size={16} />Salir
        </button>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <Avatar className="w-20 h-20">
          <AvatarImage src={localProfile.avatar_url ?? ''} />
          <AvatarFallback>{localProfile.username?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">@{localProfile.username}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">Nombre</label>
          <input type="text" name="nombre" value={localProfile.nombre ?? ''} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">Carrera</label>
          <input type="text" name="carrera" value={localProfile.carrera ?? ''} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300">Universidad</label>
          <input type="text" name="universidad" value={localProfile.universidad ?? ''} onChange={handleChange} className="input" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />} Guardar Cambios
        </button>
      </form>
    </div>
  )
}
