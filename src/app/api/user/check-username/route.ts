// File: src/app/api/user/check-username/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin' // ← service role (server)

function normalize(u: unknown) {
  return String(u ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9._-]/g, '') // solo a–z 0–9 . _ -
}

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json()
    const value = normalize(username)

    // devolvemos 200 siempre, con available=false si es muy corto
    if (!value || value.length < 3) {
      return NextResponse.json({ available: false, reason: 'too_short' }, { status: 200 })
    }

    // 1) INTENTA usar el RPC (recomendado). Ver SQL: public.username_available(p_username text)
    const { data, error } = await supabaseAdmin.rpc('username_available', { p_username: value })
    if (!error && typeof data === 'boolean') {
      return NextResponse.json({ available: data }, { status: 200 })
    }

    // 2) FALLBACK: conteo directo con service role (case-insensitive, sin comodines)
    const { count, error: qErr } = await supabaseAdmin
      .from('profiles')
      .select('id', { head: true, count: 'exact' })
      .ilike('username', value) // sin % → comparación exacta case-insensitive
    if (qErr) throw qErr

    const taken = (count ?? 0) > 0
    return NextResponse.json({ available: !taken }, { status: 200 })
  } catch (e) {
    console.error('❌ username check failed:', e)
    // No castigues al usuario con 500 → responde “no verificable”
    return NextResponse.json({ available: false, reason: 'check_failed' }, { status: 200 })
  }
}
