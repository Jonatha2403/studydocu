import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type RouteParams = { id: string } | Promise<{ id: string }>

export async function GET(_: Request, context: { params: RouteParams }) {
  const resolvedParams = await context.params
  const id = resolvedParams?.id

  if (!id) {
    return NextResponse.json({ error: 'ID de documento invalido.' }, { status: 400 })
  }

  const { data: doc, error: docError } = await supabaseAdmin
    .from('documents')
    .select(
      'id, file_name, file_path, file_url, category, created_at, user_id, approved, likes, download_count, university, university_id'
    )
    .eq('id', id)
    .maybeSingle()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Documento no encontrado.' }, { status: 404 })
  }

  if (!doc.approved) {
    return NextResponse.json({ error: 'Documento no disponible.' }, { status: 403 })
  }

  let authorUsername: string | null = null
  let authorUniversity: string | null = null

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('username, universidad')
    .eq('id', doc.user_id)
    .maybeSingle()

  if (profile) {
    authorUsername = profile.username || null
    authorUniversity = profile.universidad || null
  }

  if (!authorUniversity && doc.university_id) {
    const { data: uni } = await supabaseAdmin
      .from('universities')
      .select('name')
      .eq('id', doc.university_id)
      .maybeSingle()
    authorUniversity = uni?.name || null
  }

  const response = {
    ...doc,
    author_username: authorUsername,
    author_university: authorUniversity || doc.university || null,
    effective_download_count: Number(doc.download_count ?? 0),
  }

  return NextResponse.json(response)
}
