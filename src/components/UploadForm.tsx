'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
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
  const MAX_FILE_SIZE_MB = 25
  const MIN_FILE_SIZE_BYTES = 64
  const MIN_TEXT_CONTENT_LENGTH = 20
  const MANUAL_FIELD_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9][A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-.,()]{2,99}$/

  const calculateHash = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const hasText = (value: string) => value.trim().length > 0
  const extensionOf = (name: string) => name.toLowerCase().split('.').pop() || ''
  const isTextLikeFile = (name: string) =>
    ['txt', 'md', 'csv', 'ipynb', 'xlsx', 'xls'].includes(extensionOf(name))
  const cleanText = (value: string) => value.replace(/\s+/g, ' ').trim()
  const isValidManualText = (value: string) => MANUAL_FIELD_REGEX.test(cleanText(value))

  const isCareerValid = () => (carreraId === 'otra' ? hasText(carreraManual) : hasText(carreraId))

  const isSubjectValid = () => (materiaId === 'otra' ? hasText(materiaManual) : hasText(materiaId))

  const generatePreview = async (file: File) => {
    const lowerName = file.name.toLowerCase()

    if (
      file.type === 'text/plain' ||
      file.type === 'text/markdown' ||
      lowerName.endsWith('.txt') ||
      lowerName.endsWith('.md') ||
      lowerName.endsWith('.csv')
    ) {
      const text = await file.text()
      const compact = text
        .split('\n')
        .slice(0, 12)
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n')
      setPreviewText(compact.slice(0, 1000))
      return
    }

    if (lowerName.endsWith('.ipynb')) {
      const text = await file.text()
      try {
        const notebook = JSON.parse(text)
        const cells = Array.isArray(notebook?.cells) ? notebook.cells : []
        const extracted = cells
          .slice(0, 8)
          .map((cell: any) => {
            const source = Array.isArray(cell?.source)
              ? cell.source.join('')
              : String(cell?.source || '')
            return source.trim()
          })
          .filter(Boolean)
          .join('\n\n')
        setPreviewText(extracted.slice(0, 1200) || '[Notebook sin celdas legibles]')
      } catch {
        setPreviewText('[No se pudo leer el contenido del archivo .ipynb]')
      }
      return
    }

    if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      lowerName.endsWith('.xlsx') ||
      lowerName.endsWith('.xls')
    ) {
      try {
        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const sheet = firstSheetName ? workbook.Sheets[firstSheetName] : null
        if (!sheet) {
          setPreviewText('[No se encontro contenido legible en Excel]')
          return
        }
        const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as Array<Array<unknown>>
        const lines = matrix
          .slice(0, 10)
          .map((row) =>
            row
              .slice(0, 8)
              .map((cell) => String(cell ?? '').trim())
              .join(' | ')
          )
          .filter(Boolean)
          .join('\n')
        setPreviewText(lines || '[Excel sin filas legibles]')
      } catch {
        setPreviewText('[No se pudo generar vista previa de Excel]')
      }
      return
    }

    if (file.type.includes('pdf') || lowerName.endsWith('.pdf')) {
      setPreviewText('[Vista previa no disponible para PDF]')
      return
    }

    if (file.type.includes('word') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
      setPreviewText('[Vista previa no disponible para Word, pero el archivo se puede subir]')
      return
    }

    if (lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx')) {
      setPreviewText('[Vista previa no disponible para PowerPoint, pero el archivo se puede subir]')
      return
    }

    setPreviewText('[Tipo de archivo sin vista previa, pero puedes intentar subirlo]')
  }

  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile)
    setFileHash(null)
    setPreviewText('')
    if (selectedFile) {
      try {
        const hash = await calculateHash(selectedFile)
        setFileHash(hash)
      } catch (err) {
        console.warn('[UPLOAD_HASH_ERROR]', err)
      }
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
    const {
      data: { user: sessionUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !sessionUser?.id) {
      throw new Error('Tu sesion expiro. Inicia sesion nuevamente para subir documentos.')
    }

    if (!user) throw new Error('Usuario no autenticado.')

    const sanitizedFileName = fileToRegister.name.normalize('NFD').replace(/[^\w.\-]/g, '_')

    const ownerId = sessionUser.id
    const filePath = `${ownerId}/${Date.now()}_${sanitizedFileName}`

    let uploadErrorMessage = ''
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, fileToRegister, { upsert: false })

      if (!uploadError) {
        uploadErrorMessage = ''
        break
      }

      uploadErrorMessage = uploadError.message || 'Error desconocido al subir archivo'
      if (!/Failed to fetch/i.test(uploadErrorMessage) || attempt === 2) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 600))
    }

    if (uploadErrorMessage) {
      throw new Error(
        /row-level security|violates row-level security policy/i.test(uploadErrorMessage)
          ? 'No tienes permisos para guardar en Storage con esta sesion. Cierra sesion e inicia nuevamente.'
          : /Failed to fetch/i.test(uploadErrorMessage)
            ? 'No se pudo conectar al servidor de archivos. Revisa internet e intenta nuevamente.'
            : `Error al subir archivo: ${uploadErrorMessage}`
      )
    }

    const tipoArchivo = fileToRegister.name.split('.').pop()?.toLowerCase() || 'desconocido'

    const { data: newDocument, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: ownerId,
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
        career_name_manual: carreraId === 'otra' ? cleanText(carreraManual) : null,
        subject_id: materiaId !== 'otra' ? materiaId : null,
        subject_name_manual: materiaId === 'otra' ? cleanText(materiaManual) : null,
        file_url: filePath,
      })
      .select('id')
      .single()

    if (insertError) throw new Error(`Error al guardar metadatos: ${insertError.message}`)
    return { id: newDocument.id, content: previewText }
  }

  const handleUpload = async () => {
    if (
      !file ||
      !hasText(category) ||
      !hasText(universidadId) ||
      !isCareerValid() ||
      !isSubjectValid()
    ) {
      setFormError('Completa todos los campos antes de subir.')
      toast.warning('Faltan datos para la subida.')
      return
    }

    if (carreraId === 'otra' && !isValidManualText(carreraManual)) {
      setFormError(
        'La carrera manual debe tener entre 3 y 100 caracteres y usar solo letras, numeros y signos basicos.'
      )
      toast.warning('Corrige el campo de carrera.')
      return
    }

    if (materiaId === 'otra' && !isValidManualText(materiaManual)) {
      setFormError(
        'La materia manual debe tener entre 3 y 100 caracteres y usar solo letras, numeros y signos basicos.'
      )
      toast.warning('Corrige el campo de materia.')
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFormError(`El archivo supera ${MAX_FILE_SIZE_MB}MB. Reduce el tamano e intenta de nuevo.`)
      toast.warning(`Archivo muy grande. Maximo permitido: ${MAX_FILE_SIZE_MB}MB.`)
      return
    }

    if (file.size < MIN_FILE_SIZE_BYTES) {
      setFormError('El archivo parece vacio o corrupto. Sube un documento con contenido.')
      toast.warning('Documento vacio o demasiado pequeno.')
      return
    }

    if (isTextLikeFile(file.name)) {
      const previewContent = previewText.replace(/\[[^\]]+\]/g, '').trim()
      if (previewContent.length < MIN_TEXT_CONTENT_LENGTH) {
        setFormError('El documento no tiene contenido suficiente para publicarse.')
        toast.warning('Documento sin contenido util.')
        return
      }
    }

    setLoading(true)
    setFormError('')

    try {
      if (!fileHash) {
        try {
          const hash = await calculateHash(file)
          setFileHash(hash)
        } catch (err) {
          console.warn('[UPLOAD_HASH_RETRY_ERROR]', err)
        }
      }
      const newDocDetails = await registrarDocumento(file, category)
      const nuevosLogros = (await checkAndGrantAchievements(user!.id)) || []
      const puntosActualizados = await sumarPuntos(user!.id, 15, 'Documento subido')
      if (puntosActualizados === null) {
        const { data: perfilFallback } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', user!.id)
          .maybeSingle()
        const nextPoints = Number(perfilFallback?.points ?? 0) + 15
        const { error: fallbackUpdateError } = await supabase
          .from('profiles')
          .update({ points: nextPoints })
          .eq('id', user!.id)
        if (fallbackUpdateError) {
          console.warn('[UPLOAD_POINTS_FALLBACK_ERROR]', fallbackUpdateError.message)
        }
      }
      await registrarLogro(user!.id, 'primer_documento')
      await checkMissions(user!.id)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('studydocu:points-updated'))
      }

      if (nuevosLogros.length > 0) {
        nuevosLogros.forEach((logro) => toast.success(`🏆 Nuevo logro desbloqueado: ${logro.name}`))
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
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.ipynb"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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
        {universidades.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        value={carreraId}
        onChange={handleCarreraChange}
        className="w-full border p-2 rounded"
        disabled={!universidadId || loading}
      >
        <option value="">Selecciona carrera</option>
        {carreras.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value="otra">Otra carrera (escribir manualmente)</option>
      </select>

      {carreraId === 'otra' && (
        <input
          type="text"
          placeholder="Escribe tu carrera"
          value={carreraManual}
          onChange={(e) => setCarreraManual(e.target.value)}
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
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
        <option value="otra">Otra materia (escribir manualmente)</option>
      </select>

      {materiaId === 'otra' && (
        <input
          type="text"
          placeholder="Escribe tu materia"
          value={materiaManual}
          onChange={(e) => setMateriaManual(e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

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
        disabled={
          loading ||
          !file ||
          !hasText(category) ||
          !hasText(universidadId) ||
          !isCareerValid() ||
          !isSubjectValid() ||
          parentDisabled
        }
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Subiendo...' : '📤 Subir documento'}
      </button>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      {previewText && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <strong>Vista previa:</strong>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
            {previewText}
          </pre>
        </div>
      )}
    </div>
  )
}
