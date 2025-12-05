// src/lib/storagePath.ts

/** ¿Es una URL http/https? */
export function isHttpUrl(s: string | null | undefined): boolean {
  if (!s) return false
  return /^https?:\/\//i.test(s.trim())
}

/**
 * Extrae { bucket, key } si es URL de Supabase Storage (pública, firmada o autenticada).
 */
export function parseSupabaseStorageUrl(url: string): { bucket: string; key: string } | null {
  if (!url) return null
  const u = url.trim()
  const patterns = [
    /\/storage\/v1\/object\/sign\/([^/]+)\/([^?]+)(?:\?.*)?$/i,
    /\/storage\/v1\/object\/public\/([^/]+)\/([^?]+)(?:\?.*)?$/i,
    /\/storage\/v1\/object\/authenticated\/([^/]+)\/([^?]+)(?:\?.*)?$/i,
    /\/storage\/v1\/object\/([^/]+)\/([^?]+)(?:\?.*)?$/i,
  ]
  for (const rx of patterns) {
    const m = u.match(rx)
    if (m) {
      const bucket = m[1]
      const rawKey = m[2]
      try { return { bucket, key: decodeURIComponent(rawKey) } }
      catch { return { bucket, key: rawKey } }
    }
  }
  return null
}

/** Normaliza un file_path para usarlo como objectKey dentro de un bucket. */
export function normalizeStoragePath(raw: string, bucket: string): string {
  if (!raw) return ''
  let s = raw.trim()

  const parsed = parseSupabaseStorageUrl(s)
  if (parsed) return parsed.key

  s = s.replace(/^\/+/, '')
  if (s.toLowerCase().startsWith(`${bucket.toLowerCase()}/`)) {
    s = s.slice(bucket.length + 1)
  }

  try { s = decodeURIComponent(s) } catch {}
  s = s.replace(/\/{2,}/g, '/').trim()
  s = s.replace(/\+/g, ' ')
  s = s.replace(/^\.(\/|\\)/, '').replace(/\.\.(\/|\\)/g, '')
  return s
}
