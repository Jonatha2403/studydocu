// src/app/api/admin/delete-user/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // 0) Crear cliente admin (lazy). Si faltan env, lanzará error.
    let supabaseAdmin
    try {
      supabaseAdmin = getSupabaseAdmin()
    } catch (e) {
      console.error(
        '[DELETE_USER_CONFIG_ERROR] Faltan env para Supabase Admin:',
        e
      )
      return NextResponse.json(
        { error: 'Servidor mal configurado: falta service role de Supabase.' },
        { status: 500 }
      )
    }

    // 1) Leer body
    let body: any = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    const userId: string | undefined = body?.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'Falta userId en el cuerpo de la petición.' },
        { status: 400 }
      )
    }

    console.log('[ADMIN_DELETE_USER] Intentando eliminar userId =', userId)

    // 2) Borrar reportes hechos por el usuario
    const { error: repByUserError } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('user_id', userId)

    if (repByUserError) {
      console.error('[DELETE_USER_REPORTS_BY_USER_ERROR]', repByUserError)
      return NextResponse.json(
        { error: `Error al borrar reports del usuario: ${repByUserError.message}` },
        { status: 500 }
      )
    }

    // 3) Obtener documentos del usuario
    const { data: docsDelUsuario, error: docsErr } = await supabaseAdmin
      .from('documents')
      .select('id')
      .eq('user_id', userId)

    if (docsErr) {
      console.error('[DELETE_USER_GET_DOCS_ERROR]', docsErr)
      return NextResponse.json(
        { error: `Error al obtener documentos del usuario: ${docsErr.message}` },
        { status: 500 }
      )
    }

    // 3b) Borrar reports asociados a esos documentos
    if (docsDelUsuario && docsDelUsuario.length > 0) {
      const docIds = docsDelUsuario.map((d: any) => d.id)

      const { error: repByDocsError } = await supabaseAdmin
        .from('reports')
        .delete()
        .in('document_id', docIds)

      if (repByDocsError) {
        console.error('[DELETE_USER_REPORTS_BY_DOCS_ERROR]', repByDocsError)
        return NextResponse.json(
          {
            error: `Error al borrar reports de documentos del usuario: ${repByDocsError.message}`,
          },
          { status: 500 }
        )
      }
    }

    // 4) Borrar documentos del usuario
    const { error: delDocsErr } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('user_id', userId)

    if (delDocsErr) {
      console.error('[DELETE_USER_DELETE_DOCS_ERROR]', delDocsErr)
      return NextResponse.json(
        { error: `Error al borrar documentos del usuario: ${delDocsErr.message}` },
        { status: 500 }
      )
    }

    // 5) Borrar perfil
    const { error: delProfileErr } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (delProfileErr) {
      console.error('[DELETE_USER_DELETE_PROFILE_ERROR]', delProfileErr)
      return NextResponse.json(
        { error: `Error al borrar perfil del usuario: ${delProfileErr.message}` },
        { status: 500 }
      )
    }

    // 6) Borrar de auth.users (requiere service_role)
    const { error: authDelError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authDelError) {
      console.error('[DELETE_USER_AUTH_DELETE_ERROR]', authDelError)
      return NextResponse.json(
        { error: `Error al eliminar al usuario en auth.users: ${authDelError.message}` },
        { status: 500 }
      )
    }

    console.log('[ADMIN_DELETE_USER] Usuario eliminado OK:', userId)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[DELETE_USER_FATAL_ERROR]', err)
    return NextResponse.json(
      { error: 'Error inesperado en /api/admin/delete-user.' },
      { status: 500 }
    )
  }
}
