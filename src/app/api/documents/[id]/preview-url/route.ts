import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isHttpUrl, normalizeStoragePath, parseSupabaseStorageUrl } from '@/lib/storagePath'

type RouteParams = { id: string } | Promise<{ id: string }>

const SIGNED_URL_TTL_SECONDS = 60 * 60

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
    .select('id, approved, file_path, file_url')
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

  if (isHttpUrl(rawPath)) {
    const parsed = parseSupabaseStorageUrl(rawPath)
    if (!parsed) {
      return NextResponse.json({ url: rawPath })
    }

    const candidates = buildKeyCandidates(parsed.key, parsed.bucket)
    for (const key of candidates) {
      const { data: signed, error: signedError } = await supabaseAdmin.storage
        .from(parsed.bucket)
        .createSignedUrl(key, SIGNED_URL_TTL_SECONDS)

      if (!signedError && signed?.signedUrl) {
        return NextResponse.json({ url: signed.signedUrl })
      }
    }

    return NextResponse.json({ error: 'No se pudo firmar la URL del archivo.' }, { status: 500 })
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'documents'
  const candidates = buildKeyCandidates(rawPath, bucket)

  for (const key of candidates) {
    const { data: signed, error: signedError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(key, SIGNED_URL_TTL_SECONDS)

    if (!signedError && signed?.signedUrl) {
      return NextResponse.json({ url: signed.signedUrl })
    }
  }

  return NextResponse.json({ error: 'No se pudo generar la URL de vista previa.' }, { status: 500 })
}
