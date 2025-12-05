'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { checkAndGrantAchievements } from '@/lib/grantAchievements'
import type { User } from '@supabase/supabase-js'
import { sumarPuntos, registrarLogro, checkMissions } from '@/lib/gamification'

interface UploadFormProps {
  user: User | null
  onUploadComplete: (
    uploadedDocumentId?: string,
    uploadedDocumentContent?: string
  ) => Promise<void> | void
  disabled?: boolean
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

  const [universidades, setUniversidades] = useState<any[]>([])
  const [carreras, setCarreras] = useState<any[]>([])
  const [materias, setMaterias] = useState<any[]>([])

  const [universidadId, setUniversidadId] = useState('')
  const [carreraId, setCarreraId] = useState('')
  const [materiaId, setMateriaId] = useState('')
  const [carreraManual, setCarreraManual] = useState('')
  const [materiaManual, setMateriaManual] = useState('')

  const calculateHash = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const generatePreview = async (file: File) => {
    if (file.type === 'text/plain') {
      const text = await file.text()
      setPreviewText(text.slice(0, 500))
    } else if (file.type.includes('pdf')) {
      setPreviewText('[Vista previa no disponible para PDF]')
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      setPreviewText('[Vista previa no disponible para DOCX]')
    } else {
      setPreviewText('[Tipo de archivo no soportado para vista previa]')
    }
  }

  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile)
    setFileHash(null)
    setPreviewText('')
    if (selectedFile) {
      const hash = await calculateHash(selectedFile)
      setFileHash(hash)
      await generatePreview(selectedFile)
    }
  }

  useEffect(() => {
    const fetchUniversidades = async () => {
      const { data, error } = await supabase.from('universities').select('*')
      if (!error) setUniversidades(data || [])
    }
    fetchUniversidades()
  }, [])

  const handleUniversidadChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setUniversidadId(id)
    setCarreraId('')
    setMateriaId('')
    setCarreraManual('')
    setMateriaManual('')
    setMaterias([])

    if (id) {
      const { data } = await supabase.from('careers').select('*').eq('university_id', id)
      setCarreras(data || [])
    }
  }

  const handleCarreraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setCarreraId(id)
    setMateriaId('')
    setMateriaManual('')

    if (id && id !== 'otra') {
      const { data } = await supabase.from('subjects').select('*').eq('career_id', id)
      setMaterias(data || [])
    } else {
      setMaterias([])
    }
  }

  const handleMateriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMateriaId(e.target.value)
  }

  const registrarDocumento = async (fileToRegister: File, docCategory: string) => {
    if (!user) throw new Error('Usuario no autenticado.')

    const sanitizedFileName = fileToRegister.name
      .normalize('NFD')
      .replace(/[^\w.\-]/g, '_')

    const filePath = `${user.id}/${Date.now()}_${sanitizedFileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, fileToRegister, { upsert: false })
    if (uploadError) throw new Error(`Error al subir archivo: ${uploadError.message}`)

    const tipoArchivo = fileToRegister.name.split('.').pop()?.toLowerCase() || 'desconocido'

    const { data: newDocument, error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      file_name: fileToRegister.name,
      title: fileToRegister.name,
      file_path: filePath,
      category: docCategory,
      status: 'aprobado',
      approved: true,
      approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      hash: fileHash || null,
      download_count: 0,
      tipo: tipoArchivo,
      university_id: universidadId,
      career_id: carreraId !== 'otra' ? carreraId : null,
      career_name_manual: carreraId === 'otra' ? carreraManual : null,
      subject_id: materiaId !== 'otra' ? materiaId : null,
      subject_name_manual: materiaId === 'otra' ? materiaManual : null,
      file_url: filePath,
    }).select('id').single()

    if (insertError) throw new Error(`Error al guardar metadatos: ${insertError.message}`)
    return { id: newDocument.id, content: previewText }
  }

  const handleUpload = async () => {
    if (!file || !category || !fileHash || !universidadId || (!carreraId && !carreraManual) || (!materiaId && !materiaManual)) {
      setFormError('Completa todos los campos antes de subir.')
      toast.warning('Faltan datos para la subida.')
      return
    }

    setLoading(true)
    setFormError('')

    try {
      const newDocDetails = await registrarDocumento(file, category)
      const nuevosLogros = (await checkAndGrantAchievements(user!.id)) || []
      await sumarPuntos(user!.id, 15, 'Documento subido')
      await registrarLogro(user!.id, 'primer_documento')
      await checkMissions(user!.id)

      if (nuevosLogros.length > 0) {
        nuevosLogros.forEach(logro => toast.success(`🏆 Nuevo logro desbloqueado: ${logro.name}`))
      }

      toast.success('✅ Documento subido correctamente.')
      setFile(null)
      setCategory('')
      setPreviewText('')
      setFileHash(null)
      setUniversidadId('')
      setCarreraId('')
      setMateriaId('')
      setCarreraManual('')
      setMateriaManual('')
      setCarreras([])
      setMaterias([])

      onUploadComplete(newDocDetails.id, newDocDetails.content)
    } catch (err) {
      toast.error(`Error en la subida: ${(err as Error).message}`)
      setFormError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <input
        type="file"
        accept=".pdf,.docx,.xlsx,.txt"
        onChange={e => handleFileChange(e.target.files?.[0] || null)}
        disabled={loading || parentDisabled}
        className="w-full border p-2 rounded"
      />

      <select
        value={universidadId}
        onChange={handleUniversidadChange}
        className="w-full border p-2 rounded"
        disabled={loading}
      >
        <option value="">Selecciona universidad</option>
        {universidades.map(u => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select
        value={carreraId}
        onChange={handleCarreraChange}
        className="w-full border p-2 rounded"
        disabled={!universidadId || loading}
      >
        <option value="">Selecciona carrera</option>
        {carreras.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
        <option value="otra">Otra carrera (escribir manualmente)</option>
      </select>

      {carreraId === 'otra' && (
        <input
          type="text"
          placeholder="Escribe tu carrera"
          value={carreraManual}
          onChange={e => setCarreraManual(e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

      <select
        value={materiaId}
        onChange={handleMateriaChange}
        className="w-full border p-2 rounded"
        disabled={!carreraId || loading}
      >
        <option value="">Selecciona materia</option>
        {materias.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
        <option value="otra">Otra materia (escribir manualmente)</option>
      </select>

      {materiaId === 'otra' && (
        <input
          type="text"
          placeholder="Escribe tu materia"
          value={materiaManual}
          onChange={e => setMateriaManual(e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={e => setCategory(e.target.value)}
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
        disabled={loading || !file || !category || !fileHash || !universidadId || (!carreraId && !carreraManual) || (!materiaId && !materiaManual) || parentDisabled}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Subiendo...' : '📤 Subir documento'}
      </button>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      {previewText && (
        <div className="text-sm bg-gray-100 p-2 rounded">
          <strong>Vista previa:</strong>
          <p>{previewText}</p>
        </div>
      )}
    </div>
  )
}
