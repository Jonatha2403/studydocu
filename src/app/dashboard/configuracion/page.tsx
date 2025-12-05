// src/app/dashboard/configuracion/page.tsx
'use client'

import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Upload, User2, Images, X } from 'lucide-react'
import LottieAvatar from '@/components/LottieAvatar'

const LOTTIE_PRESETS = [
  '/avatars/lottie/avatar1.json',
  '/avatars/lottie/avatar2.json',
  '/avatars/lottie/avatar3.json',
  '/avatars/lottie/avatar4.json',
  '/avatars/lottie/avatar5.json',
  '/avatars/lottie/avatar6.json',
  '/avatars/lottie/avatar7.json',
  '/avatars/lottie/avatar8.json'
]

export default function ConfiguracionPage() {
  const { user, perfil, refrescarUsuario } = useUserContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [showLottiePicker, setShowLottiePicker] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const openFilePicker = () => fileInputRef.current?.click()

  useEffect(() => {
    console.log('✅ Configuración hidratada')
  }, [])

  // Cargar perfil
  useEffect(() => {
    if (!user) return
    setEmail(user.email ?? '')

    if (perfil) {
      setUsername(perfil.username ?? '')
      setAvatarUrl(perfil.avatar_url ?? null)
      return
    }

    ;(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('[LOAD_PROFILE_ERROR]', error)
        return
      }
      setUsername(data?.username ?? '')
      setAvatarUrl(data?.avatar_url ?? null)
    })()
  }, [user, perfil])

  /** Subir imagen desde el dispositivo */
  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.currentTarget.value = ''
    if (!file || !user) return

    try {
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen.')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Máximo 2MB.')
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        toast.error('Sesión expirada. Inicia sesión nuevamente.')
        return
      }

      const tmpUrl = URL.createObjectURL(file)
      setAvatarUrl(tmpUrl)
      setUploading(true)

      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filePath = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: false })

      if (uploadError) {
        console.error('[UPLOAD_ERROR]', uploadError)
        toast.error(uploadError.message || 'No se pudo subir el archivo.')
        setAvatarUrl(perfil?.avatar_url ?? null)
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateError) {
        console.error('[DB_UPDATE_ERROR]', updateError)
        toast.error('La imagen subió, pero no se pudo guardar en tu perfil.')
        setAvatarUrl(perfil?.avatar_url ?? null)
        return
      }

      setAvatarUrl(`${publicUrl}?v=${Date.now()}`)
      toast.success('Avatar actualizado ✨')

      // 🔄 Refrescar perfil global
      void refrescarUsuario()
    } catch (err: any) {
      console.error('[UNEXPECTED_UPLOAD_ERROR]', err)
      toast.error('Error inesperado al subir.')
      setAvatarUrl(perfil?.avatar_url ?? null)
    } finally {
      setUploading(false)
    }
  }

  /** Elegir avatar animado Lottie */
  const handleChooseLottie = async (url: string) => {
    if (!user) {
      toast.error('No hay usuario en sesión.')
      return
    }

    try {
      setSaving(true)

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        toast.error('Sesión expirada. Inicia sesión nuevamente.')
        return
      }

      const { data: updData, error: updErr } = await supabase
        .from('profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select('id')

      const updated = !updErr && (updData?.length ?? 0) > 0
      if (updated) {
        setAvatarUrl(`${url}?v=${Date.now()}`)
        toast.success('Avatar actualizado ✨')
        setShowLottiePicker(false)
        void refrescarUsuario()
        return
      }

      if (updErr) {
        console.error('[PRESET_CHOOSE_ERROR:UPDATE]', updErr)
      }

      const payloadInsert: Record<string, any> = {
        id: user.id,
        avatar_url: url,
        username: perfil?.username ?? ((username?.trim() || '') || 'usuario'),
        nombre_completo: (perfil as any)?.nombre_completo ?? 'Sin nombre',
        role: (perfil as any)?.role ?? 'user',
        email: user.email ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: insErr } = await supabase.from('profiles').insert(payloadInsert)

      if (insErr) {
        // @ts-ignore
        if (insErr.code === '23505') {
          const { error: updAfterDup } = await supabase
            .from('profiles')
            .update({ avatar_url: url, updated_at: new Date().toISOString() })
            .eq('id', user.id)

          if (updAfterDup) {
            console.error('[PRESET_CHOOSE_ERROR:UPDATE_AFTER_DUP]', updAfterDup)
            toast.error('No se pudo actualizar el avatar (duplicado).')
            return
          }

          setAvatarUrl(`${url}?v=${Date.now()}`)
          toast.success('Avatar actualizado ✨')
          setShowLottiePicker(false)
          void refrescarUsuario()
          return
        }

        console.error('[PRESET_CHOOSE_ERROR:INSERT]', insErr)
        toast.error('No se pudo guardar el avatar seleccionado.')
        return
      }

      setAvatarUrl(`${url}?v=${Date.now()}`)
      toast.success('Avatar actualizado ✨')
      setShowLottiePicker(false)
      void refrescarUsuario()
    } catch (err: any) {
      console.error('[PRESET_CHOOSE_ERROR:CATCH]', err)
      toast.error(err?.message || 'No se pudo guardar el avatar seleccionado.')
    } finally {
      setSaving(false)
    }
  }

  /** Guardar datos básicos (username + avatar actual) */
  const handleSave = async () => {
    if (!user) return
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update({
          username: (username ?? '').trim() || null,
          avatar_url: avatarUrl ? avatarUrl.split('?v=')[0] : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Perfil guardado correctamente ✅')

      // 🔄 Refrescar perfil global después de guardar
      void refrescarUsuario()
    } catch (err: any) {
      console.error('[SAVE_PROFILE_ERROR]', err)
      toast.error('No se pudo guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const cleanUrl = avatarUrl?.split('?v=')[0] || null
  const isLottie = !!cleanUrl && cleanUrl.endsWith('.json')

  return (
    <div className="p-6 space-y-8 pointer-events-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">⚙️ Configuración</h1>
        <p className="text-muted-foreground">
          Actualiza tu perfil y personaliza tu experiencia en StudyDocu.
        </p>
      </header>

      {/* Botón de prueba */}
      <div className="mb-4">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={() => alert('Click OK (botón de prueba)')}
        >
          Probar click (debug)
        </Button>
      </div>

      {/* Perfil */}
      <section className="rounded-2xl border p-5 md:p-6 space-y-6 pointer-events-auto">
        <h2 className="text-lg font-semibold">Perfil</h2>

        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          {isLottie ? (
            <LottieAvatar src={cleanUrl!} size={80} />
          ) : (
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback>
                <User2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex flex-wrap gap-3">
            {/* Subir archivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={openFilePicker}
              className="cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Subir desde mi dispositivo
                </>
              )}
            </Button>

            {/* Elegir Lottie */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLottiePicker(true)}
              className="cursor-pointer"
            >
              <Images className="mr-2 h-4 w-4" />
              Elegir avatar animado
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="tu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">
              El correo se gestiona desde la autenticación.{' '}
              <a className="underline underline-offset-2" href="/dashboard/perfil">
                Ver perfil
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSave} className="cursor-pointer">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </section>

      {/* Preferencias */}
      <section className="rounded-2xl border p-5 md:p-6 space-y-4 pointer-events-auto">
        <h2 className="text-lg font-semibold">Preferencias de interfaz</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Modo oscuro</Label>
          <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </section>

      {/* Notificaciones */}
      <section className="rounded-2xl border p-5 md:p-6 space-y-4 pointer-events-auto">
        <h2 className="text-lg font-semibold">Notificaciones</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Activar notificaciones</Label>
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </section>

      {/* Seguridad */}
      <section className="rounded-2xl border p-5 md:p-6 space-y-3 pointer-events-auto">
        <h2 className="text-lg font-semibold">Seguridad</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tu contraseña desde el flujo de autenticación.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <a href="/reset-password">Cambiar contraseña</a>
          </Button>
          <Button variant="destructive" asChild>
            <a href="/dashboard/cuenta/eliminar">Eliminar cuenta</a>
          </Button>
        </div>
      </section>

      {/* Modal Lottie avatars */}
      {showLottiePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-4 md:p-6 relative">
            <button
              onClick={() => setShowLottiePicker(false)}
              className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Images className="w-4 h-4" />
              Elige un avatar animado
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
              {LOTTIE_PRESETS.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => handleChooseLottie(src)}
                  className="rounded-xl border p-2 hover:ring-2 hover:ring-primary transition flex items-center justify-center cursor-pointer"
                >
                  <LottieAvatar src={src} size={80} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
