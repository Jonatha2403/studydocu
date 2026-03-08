import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const VALID_ORDER = new Set(['created_at', 'download_count', 'likes'])

const normalizeUniversity = (value: unknown): string | null => {
  const raw = String(value || '').trim()
  if (!raw) return null
  const lower = raw.toLowerCase()
  if (lower === 'desconocida' || lower === '-' || lower === 'null') return null
  return raw
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()
  const categoria = (searchParams.get('categoria') || '').trim()
  const universidad = (searchParams.get('universidad') || '').trim()
  const formato = (searchParams.get('formato') || '').trim().toLowerCase()
  const ordenRaw = (searchParams.get('orden') || 'created_at').trim()
  const orden = VALID_ORDER.has(ordenRaw) ? ordenRaw : 'created_at'

  let query = supabaseAdmin
    .from('documents')
    .select(
      'id, file_name, file_path, category, created_at, approved, likes, download_count, user_id, uploaded_by, university, university_id'
    )
    .eq('approved', true)
    .order(orden, { ascending: false })
    .limit(500)

  if (q) query = query.ilike('file_name', `%${q}%`)
  if (categoria && categoria !== 'Todos') query = query.eq('category', categoria)

  const { data: docs, error } = await query
  if (error) {
    return NextResponse.json({ error: 'No se pudieron cargar documentos.' }, { status: 500 })
  }

  let rows = docs || []
  if (formato && formato !== 'todos') {
    rows = rows.filter((d) =>
      String(d.file_path || '')
        .toLowerCase()
        .endsWith(`.${formato}`)
    )
  }

  const userIds = Array.from(new Set(rows.map((d) => d.user_id).filter(Boolean)))
  const uniIds = Array.from(new Set(rows.map((d) => d.university_id).filter(Boolean)))

  const [profilesRes, universitiesRes] = await Promise.all([
    userIds.length
      ? supabaseAdmin.from('profiles').select('id, username, universidad').in('id', userIds)
      : Promise.resolve({ data: [], error: null }),
    uniIds.length
      ? supabaseAdmin.from('universities').select('id, name').in('id', uniIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p]))
  const uniMap = new Map((universitiesRes.data || []).map((u) => [u.id, u.name]))

  let enriched = rows.map((d) => {
    const profile = profileMap.get(d.user_id)
    const universityName =
      normalizeUniversity(d.university) ||
      normalizeUniversity(uniMap.get(d.university_id)) ||
      normalizeUniversity(profile?.universidad) ||
      null
    const authorUsername = profile?.username || d.uploaded_by || null

    return {
      id: d.id,
      file_name: d.file_name,
      file_path: d.file_path,
      category: d.category,
      created_at: d.created_at,
      approved: d.approved,
      likes: Number(d.likes ?? 0),
      download_count: Number(d.download_count ?? 0),
      university: universityName,
      author_username: authorUsername,
    }
  })

  if (universidad && universidad !== 'Todas') {
    enriched = enriched.filter((row) => String(row.university || '').trim() === universidad)
  }

  return NextResponse.json({ items: enriched })
}
