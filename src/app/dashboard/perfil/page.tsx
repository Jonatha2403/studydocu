// src/app/dashboard/perfil/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useUserContext } from '@/context/UserContext'

// ui
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// icons
import {
  LogOut,
  Save,
  Loader2,
  Camera,
  Check,
  X,
  ArrowUpRight,
  Crown,
  Tags,
} from 'lucide-react'

// Lottie avatar
import LottieAvatar from '@/components/LottieAvatar'

interface PerfilExtendido {
  id: string
  username?: string
  points?: number
  subscription_active?: boolean
  subscription_status?: 'Activa' | 'Inactiva' | string
  universidad?: string
  nombre_completo?: string
  carrera?: string
  avatar_url?: string
  role?: string
  tags?: string[]
  updated_at?: string   // usado para cache-buster
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'unavailable'

// Helpers avatar
const getCleanUrl = (u?: string | null) => (u ? u.split('?')[0] : '')
const isLottieUrl = (u?: string | null) => getCleanUrl(u).endsWith('.json')

export default function PerfilPage() {
  const router = useRouter()
  const { user, perfil, loading } = useUserContext()

  const [saving, setSaving] = useState(false)
  const [localProfile, setLocalProfile] = useState<PerfilExtendido | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')

  // avatar upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // cache-buster para el avatar en esta página (solo imágenes)
  const [avatarVersion, setAvatarVersion] = useState<number>(Date.now())

  // 🧭 Redirigir a /iniciar-sesion si no hay usuario (cuando ya terminó loading)
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/iniciar-sesion')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!perfil) return
    setLocalProfile(perfil as PerfilExtendido)

    const ua = (perfil as Record<string, any>)?.updated_at as string | undefined
    if (ua) setAvatarVersion(new Date(ua).getTime())
  }, [perfil])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalProfile(prev => (prev ? { ...prev, [name]: value } : prev))
    if (name === 'username') setUsernameStatus('idle')
  }

  // Username availability (debounced)
  const debouncedUsername = useMemo(
    () => (localProfile?.username ? localProfile.username.trim().toLowerCase() : ''),
    [localProfile?.username]
  )

  useEffect(() => {
    let active = true
    const run = async () => {
      const u = debouncedUsername
      if (!u || u.length < 3) return setUsernameStatus('idle')
      setUsernameStatus('checking')
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', u)
        .neq('id', user?.id)
      if (!active) return
      if (error) return setUsernameStatus('idle')
      setUsernameStatus((data?.length ?? 0) === 0 ? 'available' : 'unavailable')
    }
    const t = setTimeout(run, 500)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [debouncedUsername, user?.id])

  const handleSave = async () => {
    if (!user || !localProfile) return toast.error('Usuario inválido')

    const username = localProfile.username ? localProfile.username.trim().toLowerCase() : ''
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (username && !usernameRegex.test(username)) {
      return toast.error('El nombre de usuario solo puede contener letras, números y guiones bajos.')
    }
    if (usernameStatus === 'unavailable') {
      return toast.error('El nombre de usuario ya está en uso.')
    }

    setSaving(true)
    try {
      const updates = {
        nombre_completo: (localProfile.nombre_completo ? localProfile.nombre_completo.trim() : '') || null,
        carrera: (localProfile.carrera ? localProfile.carrera.trim() : '') || null,
        universidad: (localProfile.universidad ? localProfile.universidad.trim() : '') || null,
        username: username || null,
        avatar_url: localProfile.avatar_url || null,
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
      if (error) throw error
      setAvatarVersion(Date.now())
      toast.success('Perfil actualizado correctamente')
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handlePickAvatar = () => fileInputRef.current?.click()

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona una imagen válida.')
      return
    }

    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const filePath = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, file, {
        upsert: false,
        cacheControl: '3600',
      })
      if (uploadErr) throw uploadErr

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(filePath)
      if (!pub?.publicUrl) throw new Error('No se pudo obtener la URL pública')

      const nowIso = new Date().toISOString()
      const { error: updErr } = await supabase
        .from('profiles')
        .update({ avatar_url: pub.publicUrl, updated_at: nowIso })
        .eq('id', user.id)
      if (updErr) throw updErr

      setLocalProfile(prev =>
        prev ? { ...prev, avatar_url: pub.publicUrl, updated_at: nowIso } : prev
      )
      setAvatarVersion(Date.now())
      toast.success('Avatar actualizado')
      router.refresh()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) toast.error(error.message)
    else router.push('/iniciar-sesion')
  }

  // Mientras se carga la sesión o estamos redirigiendo
  if (loading || (!user && !localProfile)) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Verificando sesión del usuario...
        </div>
      </div>
    )
  }

  // Si por algún motivo no hay perfil pero sí user (caso raro)
  if (!localProfile) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">No se pudo cargar tu perfil.</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Intenta refrescar la página o volver a iniciar sesión.
            </p>
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link href="/iniciar-sesion">Iniciar sesión</Link>
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

  // Construye src para imagen con cache-buster; si es Lottie no se usa
  const cleanUrl = getCleanUrl(localProfile.avatar_url)
  const lottie = isLottieUrl(localProfile.avatar_url)
  const avatarSrc =
    !lottie && localProfile.avatar_url
      ? `${localProfile.avatar_url}${
          localProfile.avatar_url.includes('?') ? '&' : '?'
        }v=${avatarVersion}`
      : undefined

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mi perfil</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu identidad pública y datos académicos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Salir
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || usernameStatus === 'checking'}
            className="gap-2"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{' '}
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* Card principal */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar + meta */}
            <div className="flex flex-col items-center md:items-start gap-4 min-w-[220px]">
              <div className="relative">
                {lottie ? (
                  <div className="h-24 w-24 ring-2 ring-muted rounded-full overflow-hidden grid place-items-center bg-muted">
                    <LottieAvatar src={cleanUrl} size={96} />
                  </div>
                ) : (
                  <Avatar className="h-24 w-24 ring-2 ring-muted">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback className="text-xl">
                      {localProfile.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full shadow"
                  onClick={handlePickAvatar}
                  disabled={uploadingAvatar}
                  aria-label="Cambiar avatar"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="font-semibold text-lg">
                    @{localProfile.username || 'usuario'}
                  </span>
                  {usernameStatus === 'available' && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                  {usernameStatus === 'unavailable' && (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground break-all">{user?.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {localProfile.points != null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                      <Crown className="h-3.5 w-3.5" /> {localProfile.points} pts
                    </span>
                  )}
                  {localProfile.subscription_status && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        localProfile.subscription_status === 'Activa'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {localProfile.subscription_status === 'Activa'
                        ? 'Suscripción activa'
                        : 'Suscripción inactiva'}
                    </span>
                  )}
                  {localProfile.role && (
                    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs text-muted-foreground">
                      {localProfile.role}
                    </span>
                  )}
                </div>
                {localProfile.tags && localProfile.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-muted-foreground">
                      <Tags className="h-3.5 w-3.5" /> etiquetas
                    </span>
                    {localProfile.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <Button asChild variant="link" className="p-0 h-auto text-sm">
                    <Link
                      href={`/dashboard/perfil/usuario/${localProfile.username || ''}`}
                      className="inline-flex items-center gap-1"
                    >
                      Ver perfil público <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* separador móvil */}
            <div className="md:hidden h-px bg-border" />

            {/* Formulario */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombre_completo" className="text-sm text-muted-foreground">
                  Nombre completo
                </label>
                <input
                  id="nombre_completo"
                  name="nombre_completo"
                  placeholder="Ej. Jonathan Veloz"
                  value={localProfile.nombre_completo ?? ''}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="carrera" className="text-sm text-muted-foreground">
                  Carrera
                </label>
                <input
                  id="carrera"
                  name="carrera"
                  placeholder="Ej. Ingeniería en Sistemas"
                  value={localProfile.carrera ?? ''}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="universidad" className="text-sm text-muted-foreground">
                  Universidad
                </label>
                <input
                  id="universidad"
                  name="universidad"
                  placeholder="Ej. UTPL"
                  value={localProfile.universidad ?? ''}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm text-muted-foreground">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="ej. jonathan98"
                  value={localProfile.username ?? ''}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <p className="text-[12px] text-muted-foreground">
                  Solo letras, números y _ . Debe ser único.
                </p>
                {usernameStatus === 'checking' && (
                  <p className="text-xs text-muted-foreground">Verificando disponibilidad…</p>
                )}
                {usernameStatus === 'unavailable' && (
                  <p className="text-xs text-destructive">Ese usuario ya está en uso</p>
                )}
                {usernameStatus === 'available' && (
                  <p className="text-xs text-emerald-600">Disponible ✅</p>
                )}
              </div>
            </div>
          </div>

          {/* Acciones móviles */}
          <div className="mt-6 flex md:hidden items-center gap-2">
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Salir
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || usernameStatus === 'checking'}
              className="gap-2 flex-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}{' '}
              Guardar cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-3" />
    </div>
  )
}
