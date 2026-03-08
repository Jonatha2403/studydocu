import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isHttpUrl, normalizeStoragePath, parseSupabaseStorageUrl } from '@/lib/storagePath'

type RouteParams = { id: string } | Promise<{ id: string }>

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

const buildKeyCandidates = (raw: string, bucket: string): string[] => {
  const candidates = new Set<string>()
  const push = (value?: string) => {
    if (value && value.trim()) candidates.add(value.trim())
  }

  const normalized = normalizeStoragePath(raw, bucket)
  push(normalized)

  const trimmed = raw.trim().replace(/^\/+/, '')
  if (trimmed.toLowerCase().startsWith(`${bucket.toLowerCase()}/`)) {
    push(trimmed.slice(bucket.length + 1))
  }

  try {
    push(decodeURIComponent(normalized))
  } catch {
    // noop
  }

  Array.from(candidates).forEach((key) => {
    push(key.replace(/\/{2,}/g, '/'))
    push(key.replace(/\+/g, ' '))
  })

  const parsed = parseSupabaseStorageUrl(raw)
  if (parsed) {
    push(parsed.key)
    try {
      push(decodeURIComponent(parsed.key))
    } catch {
      // noop
    }
  }

  return Array.from(candidates)
    .map((value) => value.trim())
    .filter(Boolean)
}

export async function GET(_: Request, context: { params: RouteParams }) {
  const resolvedParams = await context.params
  const id = resolvedParams?.id

  if (!id) {
    return NextResponse.json({ error: 'ID de documento invalido.' }, { status: 400 })
  }

  const { data: doc, error: docError } = await supabaseAdmin
    .from('documents')
    .select('id, approved, file_name, file_path, file_url')
    .eq('id', id)
    .maybeSingle()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Documento no encontrado.' }, { status: 404 })
  }

  if (!doc.approved) {
    return NextResponse.json(
      { error: 'Documento no disponible para vista previa.' },
      { status: 403 }
    )
  }

  const rawPath = String(doc.file_path || doc.file_url || '').trim()
  if (!rawPath) {
    return NextResponse.json({ error: 'Ruta de archivo no disponible.' }, { status: 400 })
  }

  let bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'
  let sourcePath = rawPath
  if (isHttpUrl(rawPath)) {
    const parsed = parseSupabaseStorageUrl(rawPath)
    if (!parsed) {
      return NextResponse.redirect(rawPath, 302)
    }
    bucket = parsed.bucket
    sourcePath = parsed.key
  }

  const candidates = buildKeyCandidates(sourcePath, bucket)
  for (const key of candidates) {
    const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
      .from(bucket)
      .download(key)

    if (downloadError || !fileBlob) continue

    const fileArrayBuffer = await fileBlob.arrayBuffer()
    const ext = String(doc.file_name || key)
      .toLowerCase()
      .split('.')
      .pop()
    const mime = (ext && MIME_BY_EXT[ext]) || fileBlob.type || 'application/octet-stream'

    return new Response(fileArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `inline; filename="${doc.file_name || 'documento'}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    })
  }

  return NextResponse.json(
    { error: 'No se pudo cargar el archivo para vista previa.' },
    { status: 500 }
  )
}
