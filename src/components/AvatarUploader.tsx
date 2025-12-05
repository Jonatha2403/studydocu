// src/components/AvatarUploader.tsx
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Loader2, Upload, User2 } from 'lucide-react'

type Props = {
  userId: string | null | undefined
  currentUrl?: string | null
  onUploaded?: (url: string) => void
  /** Si true, borra el archivo anterior del bucket (requiere policies UPDATE/DELETE) */
  removePrevious?: boolean
}

export default function AvatarUploader({
  userId,
  currentUrl = null,
  onUploaded,
  removePrevious = false,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)

  // Utilidad para extraer el path interno desde una URL pública
  const extractPathFromPublicUrl = (url?: string | null) => {
    if (!url) return null
    const marker = '/object/public/avatars/'
    const idx = url.indexOf(marker)
    if (idx === -1) return null
    return url.slice(idx + marker.length)
  }

  const openPicker = () => {
    const input = document.getElementById('avatar-input') as HTMLInputElement | null
    input?.click()
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.currentTarget.value = '' // permite volver a elegir el mismo archivo luego
    if (!file) return

    try {
      if (!userId) {
        toast.error('No se encontró tu sesión. Inicia sesión para subir tu avatar.')
        return
      }

      // Valida tipo y tamaño
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen.')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Máximo 2MB.')
        return
      }

      // Previsualización instantánea
      const tmpUrl = URL.createObjectURL(file)
      setPreview(tmpUrl)

      setUploading(true)

      // (Opcional) Borrar avatar anterior para no dejar archivos huérfanos
      if (removePrevious && currentUrl) {
        const oldPath = extractPathFromPublicUrl(currentUrl)
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath])
        }
      }

      // Subir al bucket en carpeta del usuario
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filePath = `${userId}/${Date.now()}.${ext}`

      // Verificar sesión antes de subir (importante para RLS)
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        toast.error('Sesión expirada. Vuelve a iniciar sesión.')
        return
      }

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: false })

      if (upErr) {
        console.error('[UPLOAD_ERROR]', upErr)
        // Revierte preview temporal
        setPreview(currentUrl)
        toast.error(upErr.message || 'No se pudo subir el archivo.')
        return
      }

      // URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      // Guardar en profiles
      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (dbErr) {
        console.error('[DB_UPDATE_ERROR]', dbErr)
        setPreview(currentUrl)
        toast.error('La imagen subió, pero no se pudo guardar en tu perfil.')
        return
      }

      // Refresca imagen en pantalla con cache‑buster
      const bust = `?v=${Date.now()}`
      setPreview(`${publicUrl}${bust}`)
      onUploaded?.(publicUrl)

      toast.success('Avatar actualizado ✨')
    } catch (err: any) {
      console.error('[UNEXPECTED_UPLOAD_ERROR]', err)
      setPreview(currentUrl)
      toast.error('Error inesperado al subir.')
    } finally {
      setUploading(false)
      // libera el blob de la previsualización temporal
      // (si quedó aún referenciado)
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={preview ?? undefined} alt="Avatar" />
        <AvatarFallback>
          <User2 className="h-8 w-8" />
        </AvatarFallback>
      </Avatar>

      <input
        id="avatar-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <Button type="button" variant="secondary" onClick={openPicker} disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Subir nuevo avatar
          </>
        )}
      </Button>
    </div>
  )
}
