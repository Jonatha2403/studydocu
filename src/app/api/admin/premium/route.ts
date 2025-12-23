// src/app/api/admin/premium/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  // ✅ Cliente del usuario (cookies/session)
  const supabase = await supabaseServer()

  // Usuario autenticado
  const { data: authData, error: authErr } = await supabase.auth.getUser()
  if (authErr || !authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const me = authData.user

  // Verifica rol admin
  const { data: myProfile, error: profErr } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', me.id)
    .maybeSingle()

  if (profErr) {
    return NextResponse.json({ error: profErr.message }, { status: 500 })
  }
  if (!myProfile || myProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Payload
  const body = await req.json().catch(() => ({}))
  const uid: string | undefined = body?.uid
  const is_premium: boolean | undefined = body?.is_premium
  const customerId: string | null = body?.customerId ?? null
  const subscriptionId: string | null = body?.subscriptionId ?? null
  const status: string | null = body?.status ?? null

  if (!uid || typeof is_premium !== 'boolean') {
    return NextResponse.json({ error: 'uid e is_premium son requeridos' }, { status: 400 })
  }

  // ✅ Cliente admin LAZY (evita romper build si falta env)
  let supabaseAdmin
  try {
    supabaseAdmin = getSupabaseAdmin()
  } catch (e) {
    console.error('[ADMIN_PREMIUM_CONFIG_ERROR] Missing env:', e)
    return NextResponse.json(
      { error: 'Servidor mal configurado: falta SUPABASE_SERVICE_ROLE_KEY o SUPABASE_URL.' },
      { status: 500 }
    )
  }

  // RPC con service_role (bypassa RLS)
  const { error } = await supabaseAdmin.rpc('admin_set_premium', {
    uid,
    p_is_premium: is_premium,
    p_customer_id: customerId,
    p_subscription_id: subscriptionId,
    p_status: status,
  })

  if (error) {
    console.error('admin_set_premium error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
