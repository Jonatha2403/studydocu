'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { checkAndGrantAchievements } from '@/lib/grantAchievements'
import type { User } from '@supabase/supabase-js'

interface UploadFormProps {
  user: User | null
  onUploadComplete: (
    uploadedDocumentId?: string,
    uploadedDocumentContent?: string
  ) => Promise<void> | void
  disabled?: boolean
}

interface DocumentEntry {
  id: string
  file_name: string
  created_at: string
  category: string
  status: string
  file_path: string
  hash?: string
}

export default function UploadForm({
  user,
  onUploadComplete,
  disabled: parentDisabled,
}: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewText, setPreviewText] = useState('')
  const [fileHash, setFileHash] = useState<string | null>(null)
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  // Línea corregida
  const [, setUploadedDocs] = useState<DocumentEntry[]>([])

  useEffect(() => {
    if (!user) {
      setUploadedDocs([])
      return
    }

    const fetchDocs = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('id, file_name, created_at, category, status, file_path, hash')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setUploadedDocs(data || [])
      } catch (err) {
        const error = err as Error
        console.error('Error fetching documents:', error)
        toast.error(`Error al cargar documentos: ${error.message}`)
      }
    }

    fetchDocs()
  }, [user])

  const registrarDocumento = async (
    fileToRegister: File,
    hash: string,
    docCategory: string
  ): Promise<{ id: string; content: string }> => {
    if (!user) throw new Error('Usuario no autenticado.')

    const filePath = `${user.id}/${Date.now()}_${fileToRegister.name}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileToRegister, {
        upsert: false,
      })

    if (uploadError) throw new Error('Error al subir archivo al storage: ' + uploadError.message)

    const { data: newDocument, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: fileToRegister.name,
        file_path: filePath,
        category: docCategory,
        hash,
        status: 'pendiente',
      })
      .select('id')
      .single()

    if (insertError)
      throw new Error('Error al guardar metadatos del documento: ' + insertError.message)
    if (!newDocument || !newDocument.id)
      throw new Error('No se pudo obtener el ID del nuevo documento.')

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'document_uploaded',
      details: {
        document_id: newDocument.id,
        file_name: fileToRegister.name,
        category: docCategory,
      },
    })

    await supabase.rpc('increment_points', {
      uid: user.id,
      amount: 10,
    })

    return { id: newDocument.id, content: previewText }
  }

  const handleUpload = async () => {
    if (!file || !category || !fileHash) {
      setFormError('Selecciona un archivo, asegúrate que se procese y elige una categoría.')
      toast.warning('Faltan datos para la subida.')
      return
    }

    if (!user) {
      setFormError('Usuario no disponible.')
      toast.error('Error de autenticación.')
      return
    }

    setLoading(true)
    setFormError('')

    const { data: recentUpload } = await supabase
      .from('documents')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (
      recentUpload?.length &&
      new Date(recentUpload[0].created_at).getTime() > Date.now() - 2 * 60 * 1000
    ) {
      setFormError('⏳ Espera 2 minutos antes de subir otro documento.')
      toast.warning('Límite de tiempo entre subidas.')
      setLoading(false)
      return
    }

    try {
      const newDocDetails = await registrarDocumento(file, fileHash, category)
      const nuevosLogros: { name: string }[] = (await checkAndGrantAchievements(user.id)) || []

      if (nuevosLogros.length > 0) {
        nuevosLogros.forEach((logro) => {
          toast.success(`🏆 Nuevo logro desbloqueado: ${logro.name}`)
        })
      }

      toast.success('✅ Documento subido y puntos ganados!')
      setFile(null)
      setCategory('')
      setPreviewText('')
      setFileHash(null)

      setUploadedDocs((prev) => [
        {
          id: newDocDetails.id,
          file_name: file.name,
          created_at: new Date().toISOString(),
          category,
          status: 'pendiente',
          file_path: `${user.id}/${Date.now()}_${file.name}`,
        },
        ...prev,
      ])

      onUploadComplete(newDocDetails.id, newDocDetails.content)
    } catch (err) {
      const error = err as Error
      setFormError(error.message)
      toast.error(`Error en la subida: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept=".pdf,.docx,.xlsx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={loading || parentDisabled}
        className="w-full border p-2 rounded"
      />
      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={!file || loading || parentDisabled}
      >
        <option value="">Selecciona categoría</option>
        <option value="Resumen">Resumen</option>
        <option value="Ensayo">Ensayo</option>
        <option value="Tarea">Tarea</option>
        <option value="Examen">Examen</option>
        <option value="Investigacion">Investigación</option>
        <option value="Otro">Otro</option>
      </select>
      <button
        onClick={handleUpload}
        disabled={loading || !file || !category || !fileHash || parentDisabled}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Subiendo...' : '📤 Subir documento'}
      </button>
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      {previewText && (
        <div className="text-sm bg-gray-100 p-2 rounded">
          <strong>Vista previa:</strong>
          <p>{previewText.slice(0, 300)}</p>
        </div>
      )}
    </div>
  )
}
