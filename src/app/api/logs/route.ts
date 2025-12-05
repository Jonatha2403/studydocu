// File: src/app/api/logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase/server' // ✅ usa el helper con @supabase/ssr

/**
 * Guarda logs de auditoría.
 * - Requiere usuario autenticado, excepto cuando la acción contenga "registro" (permite anónimo).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const action: string | undefined = body?.action
    const details = (body?.details ?? {}) as Record<string, unknown>
    const page = (body?.page ?? null) as string | null

    if (!action || typeof action !== 'string') {
      return NextResponse.json({ error: 'Falta el campo "action"' }, { status: 400 })
    }

    const supabase = await getServerClient()

    // Usuario actual (si hay)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const isRegistro = action.toLowerCase().includes('registro')

    // Si no está autenticado y no es un evento permitido anónimo → 401
    if ((authError || !user) && !isRegistro) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Metadatos básicos
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'desconocido'
    const userAgent = req.headers.get('user-agent') || 'desconocido'

    // Inserción
    const { error: insertError } = await supabase.from('audit_logs').insert([
      {
        user_id: user?.id ?? null,
        action,
        page,
        details: { ...details, ip, userAgent, page },
        created_at: new Date().toISOString(),
      },
    ])

    if (insertError) {
      console.error('❌ Error guardando log:', insertError.message)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('[API_LOGS]', err)
    return NextResponse.json(
      { error: err?.message ?? 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
