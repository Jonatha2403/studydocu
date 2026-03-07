'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, User2, Images, X, Check, AlertCircle } from 'lucide-react'
import LottieAvatar from '@/components/LottieAvatar'

const LOTTIE_PRESETS = [
  '/avatars/lottie/avatar1.json',
  '/avatars/lottie/avatar2.json',
  '/avatars/lottie/avatar3.json',
  '/avatars/lottie/avatar4.json',
  '/avatars/lottie/avatar5.json',
  '/avatars/lottie/avatar6.json',
  '/avatars/lottie/avatar7.json',
  '/avatars/lottie/avatar8.json',
]

const getCleanUrl = (u?: string | null) => (u ? u.split('?')[0] : '')
type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable'

export default function ConfiguracionPage() {
  const { user, perfil, refrescarUsuario } = useUserContext()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [showLottiePicker, setShowLottiePicker] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [usernameHelp, setUsernameHelp] = useState<string>('')

  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

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

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    const notifEnabled = localStorage.getItem('dashboard_notifications_enabled') !== 'false'
    setDarkMode(isDark)
    setNotifications(notifEnabled)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    const raw = username.trim()
    const current = (perfil?.username ?? '').trim().toLowerCase()
    const normalized = raw.toLowerCase()

    if (!normalized) {
      setUsernameStatus('idle')
      setUsernameHelp('Debe tener entre 3 y 20 caracteres.')
      return
    }

    if (!/^[a-z0-9._-]{3,20}$/i.test(raw)) {
      setUsernameStatus('unavailable')
      setUsernameHelp('Solo letras, numeros, punto, guion y guion bajo.')
      return
    }

    if (normalized === current) {
      setUsernameStatus('idle')
      setUsernameHelp('Sin cambios.')
      return
    }

    let active = true
    setUsernameStatus('checking')
    setUsernameHelp('Verificando disponibilidad...')
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/user/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: normalized }),
        })
        const payload = await res.json().catch(() => ({}))
        if (!active) return
        if (payload?.available) {
          setUsernameStatus('available')
          setUsernameHelp('Disponible.')
        } else {
          setUsernameStatus('unavailable')
          setUsernameHelp('No disponible.')
        }
      } catch {
        if (!active) return
        setUsernameStatus('idle')
        setUsernameHelp('No se pudo verificar ahora.')
      }
    }, 500)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [username, perfil?.username])

  const handleSaveSelectedAvatar = async () => {
    if (!user) {
      toast.error('No hay usuario en sesion.')
      return
    }
    if (!selectedAvatar) {
      toast.error('Selecciona un avatar.')
      return
    }

    try {
      setSaving(true)

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        toast.error('Sesion expirada. Inicia sesion nuevamente.')
        return
      }

      const updRes = await fetch('/api/user/update-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: selectedAvatar }),
      })
      const updPayload = await updRes.json().catch(() => ({}))
      if (!updRes.ok) {
        console.error('[PRESET_CHOOSE_ERROR:UPDATE]', updPayload)
        toast.error(updPayload?.error || 'No se pudo guardar el avatar seleccionado.')
        return
      }

      setAvatarUrl(`${selectedAvatar}?v=${Date.now()}`)
      setShowLottiePicker(false)
      toast.success('Avatar actualizado')
      void refrescarUsuario()
    } catch (err) {
      console.error('[PRESET_CHOOSE_ERROR:CATCH]', err)
      toast.error('No se pudo guardar el avatar seleccionado.')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      const normalized = username.trim().toLowerCase()
      const current = (perfil?.username ?? '').trim().toLowerCase()

      if (normalized && !/^[a-z0-9._-]{3,20}$/.test(normalized)) {
        toast.error('Username invalido. Usa 3-20 caracteres.')
        return
      }

      if (normalized && normalized !== current) {
        if (usernameStatus === 'checking') {
          toast.error('Espera a que termine la validacion de username.')
          return
        }
        if (usernameStatus === 'unavailable') {
          toast.error('Ese username no esta disponible.')
          return
        }
        const unameRes = await fetch('/api/user/update-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: normalized }),
        })
        const unamePayload = await unameRes.json().catch(() => ({}))
        if (!unameRes.ok) {
          toast.error(unamePayload?.error || 'No se pudo actualizar el username.')
          return
        }
      }

      const cleanAvatar = avatarUrl ? avatarUrl.split('?v=')[0] : null
      if (cleanAvatar) {
        const avatarRes = await fetch('/api/user/update-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar_url: cleanAvatar }),
        })
        if (!avatarRes.ok) {
          const payload = await avatarRes.json().catch(() => ({}))
          throw new Error(payload?.error || 'No se pudo guardar el avatar')
        }
      }

      toast.success('Perfil guardado correctamente')
      void refrescarUsuario()
    } catch (err) {
      console.error('[SAVE_PROFILE_ERROR]', err)
      toast.error('No se pudo guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked)
    localStorage.setItem('theme', checked ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', checked)
    toast.success(checked ? 'Modo oscuro activado' : 'Modo oscuro desactivado')
  }

  const handleToggleNotifications = (checked: boolean) => {
    setNotifications(checked)
    localStorage.setItem('dashboard_notifications_enabled', String(checked))
    toast.success(checked ? 'Notificaciones activadas' : 'Notificaciones desactivadas')
  }

  const cleanUrl = getCleanUrl(avatarUrl)
  const isLottie = cleanUrl.endsWith('.json')

  useEffect(() => {
    if (!showLottiePicker) return
    setSelectedAvatar(cleanUrl.endsWith('.json') ? cleanUrl : LOTTIE_PRESETS[0])
  }, [showLottiePicker, cleanUrl])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-3 pb-10 pt-4 sm:px-6 sm:pt-6">
      <header className="rounded-2xl border bg-background/70 p-4 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuracion</h1>
        <p className="text-muted-foreground">
          Actualiza tu perfil y personaliza tu experiencia en StudyDocu.
        </p>
      </header>

      <section className="rounded-2xl border bg-background p-4 sm:p-6 space-y-6">
        <h2 className="text-lg font-semibold">Perfil</h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {isLottie ? (
            <LottieAvatar src={cleanUrl} size={80} />
          ) : (
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl ?? undefined} alt="Avatar" />
              <AvatarFallback>
                <User2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLottiePicker(true)}
              className="cursor-pointer"
              disabled={saving}
            >
              <Images className="mr-2 h-4 w-4" />
              Elegir avatar animado
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="tu_usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {usernameStatus === 'available' && <Check className="h-3.5 w-3.5 text-emerald-600" />}
              {usernameStatus === 'unavailable' && (
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
              )}
              {usernameStatus === 'checking' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {usernameHelp}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">
              El correo se gestiona desde la autenticacion.{' '}
              <a className="underline underline-offset-2" href="/dashboard/perfil">
                Ver perfil
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleSave}
            className="cursor-pointer"
            disabled={saving || usernameStatus === 'checking'}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold">Preferencias de interfaz</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Modo oscuro</Label>
          <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleToggleDarkMode} />
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-4 sm:p-6 space-y-4">
        <h2 className="text-lg font-semibold">Notificaciones</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Activar notificaciones</Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-4 sm:p-6 space-y-3">
        <h2 className="text-lg font-semibold">Seguridad</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tu contrasena desde el flujo de autenticacion.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <a href="/auth/reset-password">Cambiar contrasena</a>
          </Button>
          <Button variant="destructive" asChild>
            <a href="/dashboard/cuenta/eliminar">Eliminar cuenta</a>
          </Button>
        </div>
      </section>

      {showLottiePicker && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={() => setShowLottiePicker(false)}
        >
          <div
            className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border bg-white p-4 shadow-xl sm:max-w-2xl sm:rounded-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLottiePicker(false)}
              className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-100"
              aria-label="Cerrar selector"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Images className="h-4 w-4" />
              Elige un avatar animado
            </h2>

            <div className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-3 md:grid-cols-4">
              {LOTTIE_PRESETS.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedAvatar(src)}
                  disabled={saving}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border p-2 transition disabled:opacity-60 ${
                    selectedAvatar === src
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:ring-2 hover:ring-primary/60'
                  }`}
                >
                  <LottieAvatar src={src} size={80} />
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowLottiePicker(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveSelectedAvatar} disabled={!selectedAvatar || saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar avatar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
